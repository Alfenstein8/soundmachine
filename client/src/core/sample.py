import pygame
from network.types import ApiSample
from utils.point import SamplePoint


class Sample:
    def __init__(
        self,
        sample_path,
        sample_data: ApiSample,
        point: SamplePoint,
        loop=True,
        color=5,
    ):
        self.audio = pygame.mixer.Sound(sample_path)
        self.color = color
        self.favorite = sample_data.favorite
        self.id = sample_data.id
        self.point = point

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
