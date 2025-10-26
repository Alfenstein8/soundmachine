import pygame
import launchpadSetup
from launchpad import Launchpad
from sample import Sample
import input
from point import SamplePoint
import light
from sync import ApiSample, ApiSlot, sync
from storage import SAMPLE_DIR


def loadSamples(pad: Launchpad, slots: list[ApiSlot]):
    for index, slotInfo in enumerate(slots):
        if slotInfo.sampleId is None:
            continue
        y = index // 8
        x = index % 8
        print(f"Loading sample {slotInfo.sampleId} at ({x}, {y})")
        sample = Sample(SAMPLE_DIR + f"/{slotInfo.sampleId}.wav")
        pad.addSample(sample, SamplePoint(x, y))


def main():
    pygame.mixer.init()
    lp = launchpadSetup.getLaunchpad()
    light.init(lp)

    slots, samples = sync()

    pad = Launchpad()

    loadSamples(pad, slots)

    try:
        input.run(lp)

    except KeyboardInterrupt:
        print("\nExiting Drum Pad. Cleaning up...")
    finally:
        lp.Reset()
        lp.Close()


if __name__ == "__main__":
    main()
