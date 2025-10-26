import pygame
import launchpadSetup
from launchpad import Launchpad
from sample import Sample
import input
from point import SamplePoint
import light
from sync import sync
from storage import SAMPLE_DIR


def loadSamples(pad: Launchpad, samplePaths: list[str]):
    for y in range(8):
        for x in range(8):
            index = y * 8 + x
            if index < len(samplePaths):
                sample = Sample(samplePaths[index])
                pad.addSample(sample, SamplePoint(x, y))
            else:
                return




def main():
    pygame.mixer.init()
    lp = launchpadSetup.getLaunchpad()
    light.init(lp)

    slots, samples = sync()

    samplePaths: list[str] = []
    for sample in samples:
        samplePaths.append(SAMPLE_DIR + sample.id + ".wav")


    pad = Launchpad()

    loadSamples(pad, samplePaths)



    try:
        input.run(lp)

    except KeyboardInterrupt:
        print("\nExiting Drum Pad. Cleaning up...")
    finally:
        lp.Reset()
        lp.Close()


if __name__ == "__main__":
    main()
