from enum import Enum
from launchpad_py import LaunchpadPro
from utils.point import LpPoint


class Color(Enum):
    RED = 5
    GREEN = 21
    BLUE = 45
    YELLOW = 13
    PURPLE = 80
    CYAN = 32
    WHITE = 3
    PLAY = 3
    ACTIVE = 3
    OFF = 0
    VOLUME_UP = 13
    VOLUME_DOWN = 5


class Status(Enum):
    NO_INTERNET = Color.RED.value
    SYNCING = Color.BLUE.value
    READY = Color.GREEN.value


class LightController:
    def __init__(self):
        self.lp: LaunchpadPro | None = None

    def init(self, _lp: LaunchpadPro):
        self.lp = _lp
        self.lp.LedCtrlBpm(100)
        self.set_all(Color.OFF.value)

    def set_light(self, point: LpPoint, color: int):
        if self.lp is not None:
            self.lp.LedCtrlXYByCode(point.x, point.y, color)

    def pulse_light(self, point: LpPoint, color: int):
        if self.lp is not None:
            self.lp.LedCtrlPulseXYByCode(point.x, point.y, color)

    def set_all(self, color: int):
        if color < 0 or color > 127:
            print(
                str(color)
                + " is an invalid color value. Must be between 0 and 127. setting to 3 (white)."
            )
            color = 3

        if self.lp is not None:
            # lp.LedCtrlString("je",2,255)
            self.lp.LedAllOn(color)

    def set_all_samples_color(self, color: int):
        if self.lp is not None:
            for i in range(8):
                for j in range(8):
                    pad_number = 81 - i * 10 + j
                    self.lp.LedCtrlRawByCode(pad_number, color)

    def show_all_colors(self, second_page: bool = False):
        if self.lp is not None:
            self.lp.LedCtrlRawByCode(98, 5)
            for i in range(8):
                for j in range(8):
                    color_code = i * 8 + j + 64 * second_page
                    pad_number = 81 - i * 10 + j

                    self.lp.LedCtrlRawByCode(pad_number, color_code)

    def set_status(self, status: Status):
        status_button = 10
        if self.lp is not None:
            self.lp.LedCtrlRawByCode(status_button, 0)
            if status.value == Status.READY.value:
                self.lp.LedCtrlRawByCode(status_button, status.value)
                return
            self.lp.LedCtrlFlashByCode(status_button, status.value)


light = LightController()
