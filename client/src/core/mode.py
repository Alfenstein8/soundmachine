from abc import abstractmethod
from utils.point import LpPoint


class Mode:
    @abstractmethod
    def __init__(self, launchpad):
        pass

    @abstractmethod
    def on_press(self, point: LpPoint):
        pass

    @abstractmethod
    def on_enter(self):
        pass

    @abstractmethod
    def on_exit(self):
        pass
