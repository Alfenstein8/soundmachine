import launchpad_py as launchpad


def print_mini_ports(lp: launchpad.LaunchpadPro):
    print("\n--- Available MIDI Ports ---")
    try:
        lp.ListAll()
    except Exception as e:
        print(f"Could not list MIDI ports: {e}")
    print("----------------------------\n")


def get_launchpad() -> launchpad.LaunchpadPro | None:
    print("--- Launchpad Drum Pad Initializing ---")
    lp = launchpad.LaunchpadPro()
    if lp.Check(0):
        lp.Open(0)
        print("Launchpad Pro connected successfully.")
    else:
        print(
            "No Launchpad found. Please ensure the device is connected and recognized by your system."
        )
        print_mini_ports(lp)
        return None

    lp.ButtonFlush()
    return lp
