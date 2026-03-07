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


class Status(Enum):
    NO_INTERNET = Color.RED.value
    SYNCING = Color.BLUE.value
    READY = Color.GREEN.value


LP: LaunchpadPro | None = None


def init(_lp: LaunchpadPro):
    global LP
    LP = _lp
    LP.LedCtrlBpm(100)
    set_all(Color.OFF.value)


def set_light(point: LpPoint, color: int):
    if LP is not None:
        LP.LedCtrlXYByCode(point.x, point.y, color)


def pulse_light(point: LpPoint, color: int):
    if LP is not None:
        LP.LedCtrlPulseXYByCode(point.x, point.y, color)


def set_all(color: int):
    if color < 0 or color > 127:
        print(
            str(color)
            + " is an invalid color value. Must be between 0 and 127. setting to 3 (white)."
        )
        color = 3

    if LP is not None:
        # lp.LedCtrlString("je",2,255)
        LP.LedAllOn(color)


def set_all_samples_color(color: int):
    if LP is not None:
        for i in range(8):
            for j in range(8):
                pad_number = 81 - i * 10 + j
                LP.LedCtrlRawByCode(pad_number, color)


def show_all_colors(second_page: bool = False):
    if LP is not None:
        LP.LedCtrlRawByCode(98, 5)
        for i in range(8):
            for j in range(8):
                color_code = i * 8 + j + 64 * second_page
                pad_number = 81 - i * 10 + j

                LP.LedCtrlRawByCode(pad_number, color_code)


def set_status(status: Status):
    status_button = 10
    if LP is not None:
        LP.LedCtrlRawByCode(status_button, 0)
        if status.value == Status.READY.value:
            LP.LedCtrlRawByCode(status_button, status.value)
            return
        LP.LedCtrlFlashByCode(status_button, status.value)
