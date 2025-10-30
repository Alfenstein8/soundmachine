from enum import Enum
from launchpad_py import LaunchpadPro
from point import LpPoint


class Color(Enum):
    RED = (127, 0, 0)
    GREEN = (0, 127, 0)
    BLUE = (0, 0, 127)
    YELLOW = (127, 127, 0)
    PURPLE = (127, 0, 127)
    CYAN = (0, 127, 127)
    WHITE = (127, 127, 127)
    OFF = (0, 0, 0)


class Status(Enum):
    NO_INTERNET = 5  # red
    SYNCING = 67  # blue
    READY = 21  # green


lp: LaunchpadPro | None = None


def init(_lp: LaunchpadPro):
    global lp
    lp = _lp
    lp.LedCtrlBpm(10)
    lp.LedAllOn(0)


def setLight(point: LpPoint, color: tuple[int, int, int]):
    if lp is not None:
        lp.LedCtrlXY(point.x, point.y, color[0], color[1], color[2])


def setAll(color: int):
    if color < 0 or color > 127:
        print(
            str(color)
            + " is an invalid color value. Must be between 0 and 127. setting to 3 (white)."
        )
        color = 3

    if lp is not None:
        # lp.LedCtrlString("je",2,255)
        lp.LedCtrlFlashByCode(5)


def setStatus(status: Status):
    statusButton = 10
    if lp is not None:
        lp.LedCtrlRawByCode(statusButton, 0)
        if status.value == Status.READY.value:
            lp.LedCtrlRawByCode(statusButton, status.value)
            return
        lp.LedCtrlFlashByCode(statusButton, status.value)
