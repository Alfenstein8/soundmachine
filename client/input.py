import time
import launchpad_py as launchpad
from point import (LpPoint)
from eventSignal import Signal

onPress = Signal()
onRelease = Signal()

def run(lp: launchpad.LaunchpadPro):
    while True:
        button_state = lp.ButtonStateXY()
        if button_state:
            x, y, state = button_state

            if state > 0:
                onPress.emit(LpPoint(x,y))
            else:
                onRelease.emit(LpPoint(x,y))

        time.sleep(0.005)
