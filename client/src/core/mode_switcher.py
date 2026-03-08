from typing import Callable, Dict, NamedTuple
from core.function_mode import FunctionMode
from core.launchpad import Launchpad
from core.mode import Mode
from core.modes.delete import DeleteMode
from core.modes.normal import NormalMode
from hardware import light
from hardware.input import on_press
from network.sync import sync
from utils.point import LpPoint, to_sample_point


class ControlButton(NamedTuple):
    func: Callable
    color: int | None = None


class ModeSwitcher:
    def __init__(self, launchpad: Launchpad):
        on_press.connect(self.on_press)
        self.lp = launchpad
        self.control_buttons: Dict[tuple[int, int], ControlButton] = (
            self.gen_control_buttons()
        )
        self.modes: list[Mode] = [NormalMode(self.lp), DeleteMode(self.lp)]
        self.current_mode: Mode = self.modes[FunctionMode.NORMAL.value]
        self.set_control_button_colors()

    def reset(self):
        self.lp.reset()
        self.set_control_button_colors()

    def switch_mode(self, new_mode: FunctionMode):
        self.current_mode.on_exit()
        self.current_mode = self.modes[new_mode.value]
        self.current_mode.on_enter()

    def on_press(self, point: LpPoint):
        p = to_sample_point(point)

        if p.x >= 0 and p.x < 8 and p.y >= 0 and p.y < 8:
            self.current_mode.on_press(point)
        else:
            self.handle_control_button(point)

    def handle_control_button(self, point: LpPoint):
        p = (point.x, point.y)
        if p in self.control_buttons:
            cb: ControlButton | None = self.control_buttons.get((point.x, point.y))
            if cb is not None:
                cb.func()

    def sync_button(self):
        self.reset()
        slots, samples, layers = sync()
        self.lp.load_samples(slots, samples, layers)

    def gen_control_buttons(self):
        def page1():
            light.show_all_colors(False)

        def page2():
            light.show_all_colors(True)

        def delete_mode():
            if self.current_mode == self.modes[FunctionMode.DELETE.value]:
                self.switch_mode(FunctionMode.NORMAL)
            else:
                self.switch_mode(FunctionMode.DELETE)

        dics: Dict = {
            (9, 5): ControlButton(delete_mode, light.Color.RED.value),
            (9, 6): ControlButton(page1, light.Color.CYAN.value),
            (9, 7): ControlButton(page2, light.Color.WHITE.value),
            (9, 8): ControlButton(self.sync_button),
        }
        # Make layer switch buttons
        i = 1
        for layer_id in self.lp.layers.keys():

            def make_switch_layer_func(layer_id: int):
                return lambda: self.lp.switch_layer(self.lp.layers[layer_id])

            dics[(8, i)] = ControlButton(make_switch_layer_func(layer_id))
            i += 1
        return dics

    def set_control_button_colors(self):
        for (x, y), button in self.control_buttons.items():
            if button.color is not None:
                light.set_light(LpPoint(x, y), button.color)
