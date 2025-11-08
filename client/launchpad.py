from types import LambdaType
from typing import Callable, Dict
from layer import Layer
from point import LpPoint, toSamplePoint, SamplePoint, toLpPoint
from input import onPress
from sample import Sample
import light
from storage import SAMPLE_DIR
from sync import ApiLayer, ApiSample, ApiSlot, sync


class ControlButton:
    def __init__(self, func, color: int | None = None):
        self.color: int | None = color
        self.func: Callable = func


class Launchpad:
    def __init__(self):
        onPress.connect(self.onPress)
        self.controlButtons: Dict[tuple[int, int], ControlButton] = {}
        self.allSamples: list[Sample] = []
        self.currentLayer: Layer | None = None
        self.layers: Dict[int, Layer] = {}
        self.reset()

    def reset(self):
        self.stopAllSamples()
        self.allSamples = []
        self.layers = {}
        light.setAll(light.Color.OFF.value)

    def setControlButtonColors(self):
        for (x, y), button in self.controlButtons.items():
            if button.color is not None:
                light.setLight(LpPoint(x, y), button.color)

    def stopAllSamples(self):
        for s in self.allSamples:
            s.stop()

    def onPress(self, point: LpPoint):
        p = toSamplePoint(point)

        if p.x >= 0 and p.x < 8 and p.y >= 0 and p.y < 8:
            self.handleSampleButton(point)
        else:
            self.handleControlButton(point)

    def handleSampleButton(self, point):
        p = toSamplePoint(point)
        layer = self.currentLayer
        if layer is None:
            return
        s: Sample | None = layer.get_sample(p.x, p.y)

        if s is not None:
            s.toggle()
            if s.playing():
                light.setLight(point, light.Color.PLAY.value)
            else:
                light.setLight(point, s.color)

    def handleControlButton(self, point: LpPoint):
        p = (point.x, point.y)
        if p in self.controlButtons:
            cb: ControlButton | None = self.controlButtons.get((point.x, point.y))
            if cb is not None:
                cb.func()

    def syncButton(self):
        self.reset()
        slots, samples, layers = sync()
        self.loadSamples(slots, samples, layers)

    def genControlButtons(self):
        def page1():
            light.showAllColors(False)

        def page2():
            light.showAllColors(True)

        dics: Dict = {
            (9, 6): ControlButton(page1, light.Color.CYAN.value),
            (9, 7): ControlButton(page2, light.Color.WHITE.value),
            (9, 8): ControlButton(self.syncButton),
        }
        # Make layer switch buttons
        i = 1
        for id in self.layers.keys():

            def make_switch_layer_func(layer_id: int):
                return lambda: self.switchLayer(self.layers[layer_id])

            dics[(8, i)] = ControlButton(
                make_switch_layer_func(id), light.Color.YELLOW.value
            )
            i += 1
        return dics

    def setLayerButtonColors(self, activeLayerId: int):
        i: int = 1
        for id in self.layers.keys():
            c = (
                self.layers[id].color
                if id != activeLayerId
                else light.Color.ACTIVE.value
            )
            light.setLight(LpPoint(8, i), c)
            i+=1

    def switchLayer(self, layer: Layer):
        self.stopAllSamples()
        self.currentLayer = layer

        grid = layer.get_grid()
        for y in range(8):
            for x in range(8):
                sample = grid[y][x]
                point = SamplePoint(x, y)
                lp = toLpPoint(point)
                if sample is not None:
                    light.setLight(lp, sample.color)
                else:
                    light.setLight(lp, light.Color.OFF.value)
        self.setLayerButtonColors(layer.id)

    def addSample(self, sample: Sample, point: SamplePoint, layerId: int):
        layer: Layer | None = self.layers.get(layerId)
        if layer == None:
            return

        layer.set_sample(point.x, point.y, sample)
        self.allSamples.append(sample)

    def loadSamples(
        self, slots: list[ApiSlot], samples: list[ApiSample], layers: list[ApiLayer]
    ):
        for layerInfo in layers:
            self.layers[layerInfo.id] = Layer(layerInfo)

        for index, slotInfo in enumerate(slots):
            apiSample = next((s for s in samples if s.id == slotInfo.sampleId), None)
            if slotInfo.sampleId is None or apiSample is None:
                continue
            y = slotInfo.position // 8
            x = slotInfo.position % 8
            sample = Sample(SAMPLE_DIR + f"/{slotInfo.sampleId}.wav")
            if slotInfo.color is not None:
                sample.color = slotInfo.color
            self.addSample(sample, SamplePoint(x, y), slotInfo.layerId)

        self.controlButtons = self.genControlButtons()
        self.setControlButtonColors()

        # Determine which layer to switch to
        newCurrentLayer: Layer | None = None
        for l in self.layers.values():
            if self.currentLayer != None and l.id == self.currentLayer.id:
                newCurrentLayer = l
                break

        if newCurrentLayer is None:
            newCurrentLayer = next(iter(self.layers.values()))
        self.switchLayer(newCurrentLayer)
