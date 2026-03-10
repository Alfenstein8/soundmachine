from core.function_mode import FunctionMode
from core.mode import Mode
from network.functions import set_favorite
from utils.point import LpPoint, to_sample_point


class FavoriteMode(Mode):
    def on_enter(self):
        print("Entered favorite mode")

    def on_exit(self):
        print("Exited favorite mode")

    def on_press(self, point: LpPoint):
        p = to_sample_point(point)

        sample = self.lp.get_sample_by_point(p)

        if sample is None:
            return

        set_favorite(sample.id, not sample.favorite)
        self.lp.set_favorite(p, sample.layer_id, not sample.favorite)
        self.switch_mode(FunctionMode.NORMAL)
