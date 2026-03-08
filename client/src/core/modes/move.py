from typing import Callable
from core.function_mode import FunctionMode
from core.launchpad import Launchpad
from core.mode import Mode
from core.sample import Sample
from hardware import light
from network.functions import remove_slot
from utils.point import LpPoint, SamplePoint, position_to_index, to_sample_point


class MoveMode(Mode):
    def __init__(
        self,
        launchpad: Launchpad,
        switch_mode: Callable[[FunctionMode], None],
        point: LpPoint | None = None,
        color: light.Color = light.Color.RED,
    ):
        super().__init__(launchpad, switch_mode, point, color)
        self.selected_sample: tuple[Sample,SamplePoint, int] | None = None

    def on_enter(self):
        print("Entered move mode")
        self.selected_sample = None

    def on_exit(self):
        print("Exited move mode")

    def on_press(self, point: LpPoint):
        p = to_sample_point(point)
        layer = self.lp.current_layer
        if layer is None:
            return

        sample = layer.get_sample(p.x,p.y)

        if sample is not None and self.selected_sample is None:
            self.selected_sample = (sample, p, layer.id)
            if self.point is not None:
                light.set_light(self.point, light.Color.GREEN.value)
                light.set_light(point, light.Color.ACTIVE.value)
            return

        if sample is None and self.selected_sample is not None:
            remove_slot(layer.id, position_to_index(SamplePoint(p.x, p.y)))
            old_point = self.selected_sample[1]
            old_layer_id = self.selected_sample[2]
            self.lp.remove_sample(old_point, old_layer_id)
            self.lp.add_sample(self.selected_sample[0], p, layer.id)
            light.set_light(point, self.selected_sample[0].color)
            self.switch_mode(FunctionMode.NORMAL)

