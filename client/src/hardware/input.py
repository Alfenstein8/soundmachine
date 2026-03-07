import time
import launchpad_py as launchpad
from utils.point import LpPoint
from utils.event_signal import Signal

on_press = Signal()
on_release = Signal()


def run(lp: launchpad.LaunchpadPro):
    while True:
        button_state = lp.ButtonStateXY()
        if button_state:
            x, y, state = button_state

            if state > 0:
                on_press.emit(LpPoint(x, y))
            else:
                on_release.emit(LpPoint(x, y))

        time.sleep(0.005)
