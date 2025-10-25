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

lp: LaunchpadPro | None = None
def init(_lp: LaunchpadPro):
    global lp
    lp = _lp
    lp.LedAllOn(0)

def setLight(point: LpPoint, color: Color):
    if lp is not None:
        c = color.value
        lp.LedCtrlXY(point.x, point.y, c[0], c[1], c[2])
