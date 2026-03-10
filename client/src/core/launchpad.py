from typing import Dict
from core.layer import Layer
from core.sample import Sample
from core.storage import SAMPLE_DIR
from network.types import ApiLayer, ApiSample, ApiSlot
from utils.point import LpPoint, SamplePoint, to_lp_point
from hardware.light import light, Color


class Launchpad:
    def __init__(self):
        self.all_samples: list[Sample] = []
        self.current_layer: Layer | None = None
        self.layers: Dict[int, Layer] = {}
        self.reset()

    def reset(self):
        self.stop_all_samples()
        self.all_samples = []
        self.layers = {}
        light.set_all(Color.OFF.value)

    def stop_all_samples(self):
        for s in self.all_samples:
            s.stop()

    def set_layer_button_colors(self, active_layer_id: int):
        i: int = 1
        for layer_id, layer in self.layers.items():
            c = layer.color if layer_id != active_layer_id else Color.ACTIVE.value
            light.set_light(LpPoint(8, i), c)
            i += 1

    def get_sample_by_point(self, point: SamplePoint) -> Sample | None:
        if self.current_layer is None:
            return None
        return self.current_layer.get_sample(point.x, point.y)

    def set_sample_color(self, sample: Sample, point: SamplePoint):
        if sample.favorite:
            light.pulse_light(to_lp_point(point), sample.color)
        else:
            light.set_light(to_lp_point(point), sample.color)

    # Change volume of the active/player samples
    def change_volume(self, change: int):
        if self.current_layer is None:
            return None
        playing_samples = self.current_layer.get_playing_samples()
        for s in self.all_samples:
            same_as_playing = any(ps.id == s.id for ps in playing_samples)
            if same_as_playing:
                s.set_volume(s.volume + change)
        return playing_samples

    def switch_layer(self, layer: Layer):
        self.stop_all_samples()
        self.current_layer = layer

        grid = layer.get_grid()
        for y in range(8):
            for x in range(8):
                sample = grid[y][x]
                point = SamplePoint(x, y)
                lp = to_lp_point(point)
                if sample is not None:
                    self.set_sample_color(sample, point)
                else:
                    light.set_light(lp, Color.OFF.value)
        self.set_layer_button_colors(layer.id)

    def add_sample(self, sample: Sample, point: SamplePoint, layer_id: int):
        layer: Layer | None = self.layers.get(layer_id)
        if layer is None:
            return

        layer.set_sample(point.x, point.y, sample)
        self.all_samples.append(sample)

    def remove_sample(self, point: SamplePoint, layer_id: int):
        layer: Layer | None = self.layers.get(layer_id)
        if layer is None:
            return
        sample = layer.get_sample(point.x, point.y)
        if sample is not None:
            sample.stop()
            self.all_samples.remove(sample)
            layer.remove_sample(point.x, point.y)
            light.set_light(to_lp_point(point), Color.OFF.value)

    def set_favorite(self, point: SamplePoint, layer_id: int, favorite: bool):
        layer: Layer | None = self.layers.get(layer_id)
        if layer is None:
            return
        sample = layer.get_sample(point.x, point.y)

        if sample is None:
            return

        for s in self.all_samples:
            if s.id == sample.id:
                s.favorite = favorite
                if self.current_layer and s.layer_id == self.current_layer.id:
                    self.set_sample_color(s, s.point)

    def load_samples(
        self, slots: list[ApiSlot], samples: list[ApiSample], layers: list[ApiLayer]
    ):
        for layer_info in layers:
            self.layers[layer_info.id] = Layer(layer_info)

        for _, slot_info in enumerate(slots):
            api_sample = next((s for s in samples if s.id == slot_info.sampleId), None)
            if slot_info.sampleId is None or api_sample is None:
                continue
            y = slot_info.position // 8
            x = slot_info.position % 8
            sample = Sample(
                SAMPLE_DIR + slot_info.sampleId + ".wav",
                api_sample,
                SamplePoint(x, y),
                slot_info.layerId,
            )
            if slot_info.color is not None:
                sample.color = slot_info.color
            self.add_sample(sample, SamplePoint(x, y), slot_info.layerId)

        # Determine which layer to switch to
        new_current_layer: Layer | None = None
        for l in self.layers.values():
            if self.current_layer is not None and l.id == self.current_layer.id:
                new_current_layer = l
                break

        if new_current_layer is None:
            new_current_layer = next(iter(self.layers.values()))
        self.switch_layer(new_current_layer)
