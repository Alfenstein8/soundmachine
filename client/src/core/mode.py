from abc import abstractmethod
from typing import Callable
from core.function_mode import FunctionMode
from core.launchpad import Launchpad
from hardware import light
from utils.point import LpPoint


class Mode:
    def __init__(
        self,
        launchpad: Launchpad,
        switch_mode: Callable[[FunctionMode], None],
        point: LpPoint | None = None,
        color: light.Color = light.Color.RED,
    ):
        self.lp = launchpad
        self.switch_mode = switch_mode
        self.point = point
        self.color = color

    @abstractmethod
    def on_press(self, point: LpPoint):
        pass

    def before_enter(self):
        if self.point is not None:
            light.set_light(self.point, light.Color.ACTIVE.value)

    @abstractmethod
    def on_enter(self):
        pass

    @abstractmethod
    def on_exit(self):
        pass

    def after_exit(self):
        if self.point is not None:
            light.set_light(self.point, self.color.value)
