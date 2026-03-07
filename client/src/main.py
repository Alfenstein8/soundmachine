import sys
import traceback
import time
from multiprocessing import Process
from launchpad_py import LaunchpadPro
import pygame
from hardware import launchpad_setup
from hardware import input as lp_input
from hardware import light
from core.launchpad import Launchpad
from network.sync import sync

CLEAN_EXIT_CODE = 0
RECONNECT_DELAY = 5  # seconds


def init(lp: LaunchpadPro):
    pygame.mixer.init()
    light.init(lp)
    pad = Launchpad()
    slots, samples, layers = sync()
    pad.load_samples(slots, samples, layers)


def app_process():
    try:
        lp: LaunchpadPro | None = None

        if lp is None:
            lp = launchpad_setup.get_launchpad()
            if lp is None:
                print("Trying to connect to launchpad")
                sys.exit(1)

        try:
            init(lp)
            lp_input.run(lp)
        # pylint: disable=W0703
        except Exception:
            try:
                if lp:
                    lp.Close()  # Important: try to close gracefully
            except Exception as close_err:
                print(f"Error during graceful Close: {close_err}")
    except KeyboardInterrupt:
        sys.exit(CLEAN_EXIT_CODE)
    # pylint: disable=W0703
    except Exception as e:
        print(f"App process failed: {e}")  # This will show up in journalctl

        traceback.print_exc()
        sys.exit(1)


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
