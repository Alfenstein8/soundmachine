from point import LpPoint, toSamplePoint, SamplePoint, toLpPoint
from input import onPress
from sample import Sample
import light


class Launchpad:
    def __init__(self):
        onPress.connect(self.onPress)
        self.samples: list[list[Sample | None]] = [[None] * 8 for _ in range(8)]

    def addSample(self, sample: Sample, point: SamplePoint):
        self.samples[point.x][point.y] = sample

    def onPress(self, point: LpPoint):
        p = toSamplePoint(point)
        print("Pressed:", p.x, p.y)
        s = self.samples[p.x][p.y]

        if s is not None:
            print(s)
            s.toggle()
            light.setLight(point,light.Color.GREEN)

