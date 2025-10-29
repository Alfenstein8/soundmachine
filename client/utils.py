def hexToRgb(hexColor: str) -> tuple[int, int, int]:
    h = hexColor.lstrip("#")
    return tuple[int, int, int](tuple(int(h[i : i + 2], 16) for i in (0, 2, 4)))
