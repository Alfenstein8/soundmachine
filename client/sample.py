import pygame
from sync import ApiSample


class Sample:
    def __init__(self, sample_path, sampleData: ApiSample, loop=True, color=5):
        self.audio = pygame.mixer.Sound(sample_path)
        self.color = color
        self.favorite = sampleData.favorite

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
