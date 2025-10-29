import pygame
import launchpadSetup
from launchpad import Launchpad
import input
import light
from sync import sync

def init():
    pad = Launchpad()
    slots, samples = sync()
    pad.loadSamples(slots, samples)

def main():
    pygame.mixer.init()
    lp = launchpadSetup.getLaunchpad()
    light.init(lp)

    init()

    try:
        input.run(lp)

    except KeyboardInterrupt:
        print("\nExiting Drum Pad. Cleaning up...")
    finally:
        lp.Reset()
        lp.Close()


if __name__ == "__main__":
    main()
