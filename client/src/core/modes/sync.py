from core.function_mode import FunctionMode
from core.mode import Mode
from network.sync import sync
from utils.point import LpPoint


class SyncMode(Mode):
    def on_enter(self):
        print("Exited sync mode")
        slots, samples, layers = sync()
        self.lp.load_samples(slots, samples, layers)
        self.switch_mode(FunctionMode.NORMAL)

    def on_exit(self):
        print("Exited sync mode")

    def on_press(self, point: LpPoint):
        pass
