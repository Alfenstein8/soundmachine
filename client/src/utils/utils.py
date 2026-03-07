def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    h = hex_color.lstrip("#")
    return tuple[int, int, int](tuple(int(h[i : i + 2], 16) for i in (0, 2, 4)))
