from core.function_mode import FunctionMode
from core.mode import Mode
from network.functions import remove_slot
from utils.point import LpPoint, SamplePoint, position_to_index, to_sample_point


class DeleteMode(Mode):
    def __init__(self, launchpad):
        self.lp = launchpad

    def on_enter(self):
        print("Entered delete mode")

    def on_exit(self):
        print("Exited delete mode")

    def on_press(self, point: LpPoint):
        p = to_sample_point(point)
        layer = self.lp.current_layer
        if layer is None:
            return

        remove_slot(layer.id, position_to_index(SamplePoint(p.x, p.y)))
        self.lp.switch_mode(FunctionMode.NORMAL)
