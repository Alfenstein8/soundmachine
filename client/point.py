class SamplePoint():
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

class LpPoint():
    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y


def toSamplePoint(lpPoint: LpPoint) -> SamplePoint:
    return SamplePoint(lpPoint.x, lpPoint.y-1)


def toLpPoint(trackPoint: SamplePoint) -> LpPoint:
    return LpPoint(trackPoint.x, trackPoint.y+1)
