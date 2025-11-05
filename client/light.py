from enum import Enum
from launchpad_py import LaunchpadPro
from point import LpPoint


class Color(Enum):
    RED = 5
    GREEN = 20
    BLUE = 45
    YELLOW = 12
    PURPLE = 48
    CYAN = 32
    WHITE = 4
    OFF = 0


class Status(Enum):
    NO_INTERNET = Color.RED.value
    SYNCING = Color.BLUE.value
    READY = Color.GREEN.value


lp: LaunchpadPro | None = None


def init(_lp: LaunchpadPro):
    global lp
    lp = _lp
    lp.LedCtrlBpm(10)
    setAll(Color.OFF.value)


def setLight(point: LpPoint, color: int):
    if lp is not None:
        lp.LedCtrlXYByCode(point.x, point.y, color)


def setAll(color: int):
    if color < 0 or color > 127:
        print(
            str(color)
            + " is an invalid color value. Must be between 0 and 127. setting to 3 (white)."
        )
        color = 3

    if lp is not None:
        # lp.LedCtrlString("je",2,255)
        lp.LedAllOn(color)


def showAllColors(secondPage: bool = False):
    if lp is not None:
        lp.LedCtrlRawByCode(98, 5)
        for i in range(8):
            for j in range(8):
                colorCode = i * 8 + j + 64 * secondPage
                padNumber = 81 - i * 10 + j

                lp.LedCtrlRawByCode(padNumber, colorCode)


def setStatus(status: Status):
    statusButton = 10
    if lp is not None:
        lp.LedCtrlRawByCode(statusButton, 0)
        if status.value == Status.READY.value:
            lp.LedCtrlRawByCode(statusButton, status.value)
            return
        lp.LedCtrlFlashByCode(statusButton, status.value)
