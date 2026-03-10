from typing import Callable, Dict, NamedTuple
from core.function_mode import FunctionMode
from core.launchpad import Launchpad
from core.mode import Mode
from core.modes.delete import DeleteMode
from core.modes.favorite import FavoriteMode
from core.modes.move import MoveMode
from core.modes.normal import NormalMode
from core.modes.sync import SyncMode
from hardware import light
from hardware.input import on_press
from network.functions import update_sample
from utils.point import LpPoint, to_sample_point


class ControlButton(NamedTuple):
    func: Callable
    color: int | None = None


class ModeSwitcher:
    def __init__(self, launchpad: Launchpad):
        on_press.connect(self.on_press)
        self.lp = launchpad
        self.layer_buttons: Dict[tuple[int, int], ControlButton] = (
            self.gen_layer_buttons()
        )
        self.modes: list[Mode] = [
            NormalMode(self.lp, self.switch_mode),
            DeleteMode(self.lp, self.switch_mode, LpPoint(9, 4)),
            FavoriteMode(self.lp, self.switch_mode, LpPoint(9, 6)),
            SyncMode(self.lp, self.switch_mode, LpPoint(9, 8)),
            MoveMode(self.lp, self.switch_mode, LpPoint(9, 2)),
        ]
        self.current_mode: Mode = self.modes[FunctionMode.NORMAL.value]
        self.set_button_colors()

    def switch_mode(self, new_mode: FunctionMode):
        self.current_mode.on_exit()
        self.current_mode.after_exit()
        self.current_mode = self.modes[new_mode.value]
        self.current_mode.before_enter()
        self.current_mode.on_enter()

    def on_press(self, point: LpPoint):
        p = to_sample_point(point)
        if p.x >= 0 and p.x < 8 and p.y >= 0 and p.y < 8:
            self.current_mode.on_press(point)
        else:
            self.handle_control_button(point)

    def handle_control_button(self, point: LpPoint):
        p = (point.x, point.y)
        if p in self.layer_buttons:
            cb: ControlButton | None = self.layer_buttons.get((point.x, point.y))
            if cb is not None:
                cb.func()

        for m in self.modes:
            if m.point == point:
                self.mode_press(FunctionMode(self.modes.index(m)))

    def mode_press(self, mode: FunctionMode):
        if self.current_mode == self.modes[mode.value]:
            self.switch_mode(FunctionMode.NORMAL)
        else:
            self.switch_mode(mode)

    def change_volume(self, change: int):
        samples = self.lp.change_volume(change)
        if samples is None:
            return
        for s in samples:
            update_sample(s)

    def gen_layer_buttons(self):
        dics: Dict = {
            (4,9): ControlButton(lambda: self.change_volume(10), light.Color.VOLUME_UP.value),
            (3,9): ControlButton(lambda: self.change_volume(-10), light.Color.VOLUME_DOWN.value),
        }
        # Make layer switch buttons
        i = 1
        for layer_id in self.lp.layers.keys():
            def make_switch_layer_func(layer_id: int):
                return lambda: self.lp.switch_layer(self.lp.layers[layer_id])
            dics[(8, i)] = ControlButton(make_switch_layer_func(layer_id))
            i += 1
        return dics

    def set_button_colors(self):
        for (x, y), button in self.layer_buttons.items():
            if button.color is not None:
                light.set_light(LpPoint(x, y), button.color)
        for m in self.modes:
            if m.point is not None:
                light.set_light(m.point, m.color.value)
