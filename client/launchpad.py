from types import LambdaType
from typing import Dict
from point import LpPoint, toSamplePoint, SamplePoint, toLpPoint
from input import onPress
from sample import Sample
import light
from storage import SAMPLE_DIR
from sync import ApiSample, ApiSlot, sync
from utils import hexToRgb


class ControlButton:
    def __init__(self, color: tuple[int, int, int], func):
        self.color = color
        self.func: LambdaType = func

class Launchpad:
    def __init__(self):
        onPress.connect(self.onPress)
        self.controlButtons = self.setControlButtons()
        self.samples: list[Sample] = []
        self.setControlButtonColors()
        self.reset()

    def setControlButtonColors(self):
        for (x, y), button in self.controlButtons.items():
            light.setLight(LpPoint(x, y), button.color)


    def reset(self):
        for s in self.samples:
            s.stop()
        self.samples = []
        self.samplesGrid: list[list[Sample | None]] = [[None] * 8 for _ in range(8)]
        light.setAll(0)
        self.setControlButtonColors()

    def addSample(self, sample: Sample, point: SamplePoint):
        self.samplesGrid[point.x][point.y] = sample
        self.samples.append(sample)
        light.setLight(toLpPoint(point), sample.color)

    def onPress(self, point: LpPoint):
        p = toSamplePoint(point)

        if p.x >= 0 and p.x < 8 and p.y >= 0 and p.y < 8:
            self.handleSampleButton(point)
        else:
            self.handleControlButton(point)

    def handleSampleButton(self, point):
        p = toSamplePoint(point)
        s = self.samplesGrid[p.x][p.y]

        if s is not None:
            s.toggle()
            if s.playing():
                light.setLight(point, light.Color.GREEN.value)
            else:
                light.setLight(point, s.color)

    def handleControlButton(self, point: LpPoint):
        p = (point.x, point.y)
        if p in self.controlButtons:
           self.controlButtons.get((point.x, point.y), lambda: None).func()

    def syncButton(self):
        self.reset()
        slots, samples = sync()
        self.loadSamples(slots, samples)

    def setControlButtons(self):
        dics: Dict = {
                (0, 0): ControlButton(light.Color.RED.value, self.syncButton)
        }
        return dics

    def loadSamples(self , slots: list[ApiSlot], samples: list[ApiSample]):
        for index, slotInfo in enumerate(slots):
            apiSample = next((s for s in samples if s.id == slotInfo.sampleId), None)
            if slotInfo.sampleId is None or apiSample is None:
                continue
            y = index // 8
            x = index % 8
            sample = Sample(SAMPLE_DIR + f"/{slotInfo.sampleId}.wav")
            if slotInfo.color is not None:
                sample.color = hexToRgb(slotInfo.color)
            self.addSample(sample, SamplePoint(x, y))
