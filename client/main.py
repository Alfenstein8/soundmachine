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
    slots, samples = sync()
    pad.loadSamples(slots, samples)


def app_process():
    try:
        pygame.mixer.init()
        lp = None

        if lp is None:
            lp = launchpadSetup.getLaunchpad()
            if lp is None:
                print("Tryingh to connect to launchpad")
                exit(1)

        try:
            light.init(lp)
            init()
            input.run(lp)

        except Exception as e:
            try:
                if lp:
                    lp.Close()  # Important: try to close gracefully
            except Exception as close_err:
                print(f"Error during graceful Close: {close_err}")
    except KeyboardInterrupt:
            exit(CLEAN_EXIT_CODE)
    except SystemExit:
        raise
    except:
        exit(1)



def supervisor():
    p = None
    try:
        while True:
            p = Process(target=app_process)
            p.start()
            p.join()
            exit_code = p.exitcode
            if exit_code == CLEAN_EXIT_CODE:
                print("Exiting supervisor loop")
                break
            else:
                time.sleep(RECONNECT_DELAY)
    except KeyboardInterrupt:
            print("\nSupervisor received shutdown signal. Terminating application process...")
            if p != None and p.is_alive():
                p.terminate() # Forcefully stop the child process
                p.join()
            print("Supervisor stopped.")

if __name__ == "__main__":
    try:
        supervisor()
    except KeyboardInterrupt:
        print("Closing program")
    print("Something went very wrong")

