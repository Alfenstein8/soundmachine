import pygame
from network.types import ApiSample
from utils.point import SamplePoint


class Sample:  # pylint: disable=too-many-instance-attributes
    # pylint: disable=too-many-arguments, too-many-positional-arguments
    def __init__(
        self,
        sample_path,
        sample_data: ApiSample,
        point: SamplePoint,
        layer_id: int,
        loop=True,
    ):
        self.audio = pygame.mixer.Sound(sample_path)
        self.color: int = 5
        self.favorite: bool = sample_data.favorite
        self.id: str = sample_data.id
        self.layer_id: int = layer_id
        self.point: SamplePoint = point

        self.volume: int
        self.set_volume(sample_data.volume)

        self.loop = loop

    def playing(self) -> bool:
        return self.audio.get_num_channels() > 0

    def play(self):
        if self.loop:
            self.audio.play(-1)
        else:
            self.audio.play()

    def stop(self):
        self.audio.stop()

    def toggle(self):
        if self.playing():
            self.stop()
        else:
            self.play()

    def set_volume(self, volume: int):
        self.volume = max(0, min(100, volume))
        self.audio.set_volume(volume / 100)
