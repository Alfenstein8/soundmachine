import time
import pygame
import launchpadSetup
from launchpad import Launchpad
import input
import light
from multiprocessing import Process
from sync import ApiSample, ApiSlot, sync


CLEAN_EXIT_CODE = 0
RECONNECT_DELAY = 5  # seconds


def init():
    pad = Launchpad()
    slots, samples, layers = sync()
    pad.loadSamples(slots, samples, layers)


def app_process():
    try:
        lp = None

        if lp is None:
            lp = launchpadSetup.getLaunchpad()
            if lp is None:
                print("Trying to connect to launchpad")
                exit(1)

        try:
            pygame.mixer.init()
            light.init(lp)
            init()
            input.run(lp)

        except Exception:
            try:
                if lp:
                    lp.Close()  # Important: try to close gracefully
            except Exception as close_err:
                print(f"Error during graceful Close: {close_err}")
    except KeyboardInterrupt:
        exit(CLEAN_EXIT_CODE)
    except SystemExit:
        raise
    except Exception as e:
        print(f"App process failed: {e}")  # This will show up in journalctl
        import traceback

        traceback.print_exc()
        exit(1)


def supervisor():
    p = None
    try:
        while True:
            p = Process(target=app_process)
            p.start()
            p.join()
            print(f"Child process exited with exit code {p.exitcode} ")
            time.sleep(RECONNECT_DELAY)
    except KeyboardInterrupt:
        print(
            "\nSupervisor received shutdown signal. Terminating application process..."
        )
        if p is not None and p.is_alive():
            p.terminate()  # Forcefully stop the child process
            p.join()
        print("Supervisor stopped.")


if __name__ == "__main__":
    try:
        supervisor()
    except KeyboardInterrupt:
        print("Closing program")
