class SamplePoint:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y


class lp_point:
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y


def to_sample_point(point: lp_point) -> SamplePoint:
    return SamplePoint(point.x, point.y - 1)


def to_lp_point(track_point: SamplePoint) -> lp_point:
    return lp_point(track_point.x, track_point.y + 1)
