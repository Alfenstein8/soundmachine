from typing import NamedTuple


class SamplePoint(NamedTuple):
    x: int
    y: int


class LpPoint(NamedTuple):
    x: int
    y: int


def to_sample_point(point: LpPoint) -> SamplePoint:
    return SamplePoint(point.x, point.y - 1)


def to_lp_point(track_point: SamplePoint) -> LpPoint:
    return LpPoint(track_point.x, track_point.y + 1)


def position_to_index(sample_point: SamplePoint) -> int:
    return sample_point.y * 8 + sample_point.x
