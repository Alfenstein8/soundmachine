import launchpad_py as launchpad
import sys

def printMiniPorts(launchpad: launchpad.LaunchpadPro):
    print("\n--- Available MIDI Ports ---")
    try:
        launchpad.ListAll()
    except Exception as e:
        print(f"Could not list MIDI ports: {e}")
    print("----------------------------\n")


def getLaunchpad() -> launchpad.LaunchpadPro:
    print("--- Launchpad Drum Pad Initializing ---")
    lp = launchpad.LaunchpadPro()
    printMiniPorts(lp)
    if lp.Open():
        print(
            "A Launchpad device was connected, but the specific name 'Launchpad Pro' was not found.")
    else:
        print(
            "No Launchpad found. Please ensure the device is connected and recognized by your system.")
        sys.exit(1)

    lp.ButtonFlush()
    return lp
