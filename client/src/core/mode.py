from abc import abstractmethod
from typing import Callable
from core.function_mode import FunctionMode
from core.launchpad import Launchpad
from utils.point import LpPoint


class Mode:
    def __init__(
        self, launchpad: Launchpad, switch_mode: Callable[[FunctionMode], None]
    ):
        self.lp = launchpad
        self.switch_mode = switch_mode

    @abstractmethod
    def on_press(self, point: LpPoint):
        pass

    @abstractmethod
    def on_enter(self):
        pass

    @abstractmethod
    def on_exit(self):
        pass
