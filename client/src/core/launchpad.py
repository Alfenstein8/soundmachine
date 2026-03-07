from typing import Callable, Dict, NamedTuple
from core.layer import Layer
from core.sample import Sample
from core.storage import SAMPLE_DIR
from utils.point import LpPoint, to_sample_point, SamplePoint, to_lp_point
from hardware.input import on_press
from hardware import light
from network.sync import ApiLayer, ApiSample, ApiSlot, sync


class ControlButton(NamedTuple):
    func: Callable
    color: int | None = None


class Launchpad:
    def __init__(self):
        on_press.connect(self.on_press)
        self.control_buttons: Dict[tuple[int, int], ControlButton] = {}
        self.all_samples: list[Sample] = []
        self.current_layer: Layer | None = None
        self.layers: Dict[int, Layer] = {}
        self.reset()

    def reset(self):
        self.stop_all_samples()
        self.all_samples = []
        self.layers = {}
        light.set_all(light.Color.OFF.value)

    def set_control_button_colors(self):
        for (x, y), button in self.control_buttons.items():
            if button.color is not None:
                light.set_light(LpPoint(x, y), button.color)

    def stop_all_samples(self):
        for s in self.all_samples:
            s.stop()

    def on_press(self, point: LpPoint):
        p = to_sample_point(point)

        if p.x >= 0 and p.x < 8 and p.y >= 0 and p.y < 8:
            self.handle_sample_button(point)
        else:
            self.handle_control_button(point)

    def handle_sample_button(self, point):
        p = to_sample_point(point)
        layer = self.current_layer
        if layer is None:
            return
        s: Sample | None = layer.get_sample(p.x, p.y)

        if s is not None:
            s.toggle()
            if s.playing():
                light.set_light(point, light.Color.PLAY.value)
            else:
                self.set_sample_color(s, p)

    def handle_control_button(self, point: LpPoint):
        p = (point.x, point.y)
        if p in self.control_buttons:
            cb: ControlButton | None = self.control_buttons.get((point.x, point.y))
            if cb is not None:
                cb.func()

    def sync_button(self):
        self.reset()
        slots, samples, layers = sync()
        self.load_samples(slots, samples, layers)

    def gen_control_buttons(self):
        def page1():
            light.show_all_colors(False)

        def page2():
            light.show_all_colors(True)

        dics: Dict = {
            (9, 6): ControlButton(page1, light.Color.CYAN.value),
            (9, 7): ControlButton(page2, light.Color.WHITE.value),
            (9, 8): ControlButton(self.sync_button),
        }
        # Make layer switch buttons
        i = 1
        for layer_id in self.layers.keys():

            def make_switch_layer_func(layer_id: int):
                return lambda: self.switch_layer(self.layers[layer_id])

            dics[(8, i)] = ControlButton(
                make_switch_layer_func(layer_id), light.Color.YELLOW.value
            )
            i += 1
        return dics

    def set_layer_button_colors(self, active_layer_id: int):
        i: int = 1
        for layer_id in self.layers.keys():
            c = (
                self.layers[layer_id].color
                if layer_id != active_layer_id
                else light.Color.ACTIVE.value
            )
            light.set_light(LpPoint(8, i), c)
            i += 1

    def set_sample_color(self, sample: Sample, point: SamplePoint):
        if sample.favorite:
            light.pulse_light(to_lp_point(point), sample.color)
        else:
            light.set_light(to_lp_point(point), sample.color)

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
                    light.set_light(lp, light.Color.OFF.value)
        self.set_layer_button_colors(layer.id)

    def add_sample(self, sample: Sample, point: SamplePoint, layer_id: int):
        layer: Layer | None = self.layers.get(layer_id)
        if layer is None:
            return

        layer.set_sample(point.x, point.y, sample)
        self.all_samples.append(sample)

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
            sample = Sample(SAMPLE_DIR + f"/{slot_info.sampleId}.wav", api_sample)
            if slot_info.color is not None:
                sample.color = slot_info.color
            self.add_sample(sample, SamplePoint(x, y), slot_info.layerId)

        self.control_buttons = self.gen_control_buttons()
        self.set_control_button_colors()

        # Determine which layer to switch to
        new_current_layer: Layer | None = None
        for l in self.layers.values():
            if self.current_layer is not None and l.id == self.current_layer.id:
                new_current_layer = l
                break

        if new_current_layer is None:
            new_current_layer = next(iter(self.layers.values()))
        self.switch_layer(new_current_layer)
