from core.launchpad import Launchpad
from core.mode import Mode
from core.sample import Sample
from hardware import light
from utils.point import LpPoint, to_sample_point


class NormalMode(Mode):
    def __init__(self, launchpad: Launchpad):
        self.lp = launchpad

    def on_enter(self):
        print("Entered normal mode")

    def on_exit(self):
        print("Exited normal mode")

    def on_press(self, point: LpPoint):
        p = to_sample_point(point)
        layer = self.lp.current_layer
        if layer is None:
            return
        s: Sample | None = layer.get_sample(p.x, p.y)

        if s is not None:
            s.toggle()
            if s.playing():
                light.set_light(point, light.Color.PLAY.value)
            else:
                self.lp.set_sample_color(s, p)
