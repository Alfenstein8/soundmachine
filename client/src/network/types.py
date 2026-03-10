from typing import NamedTuple


class ApiSample(NamedTuple):
    id: str
    name: str
    favorite: bool
    volume: int


class ApiSlot(NamedTuple):
    sampleId: str
    color: int
    position: int
    layerId: int


class ApiLayer(NamedTuple):
    id: int
    color: int
