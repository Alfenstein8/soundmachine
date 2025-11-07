from sample import Sample


class Layer:
    def __init__(self):
        self.grid: list[list[Sample | None]] = [[None] * 8 for _ in range(8)]

    def set_sample(self, x: int, y: int, sample: Sample) -> None:
        self.grid[y][x] = sample

    def get_sample(self, x: int, y: int) -> Sample | None:
        return self.grid[y][x]

    def get_row(self, y: int) -> list[Sample | None]:
        return self.grid[y]

    def get_column(self, x: int) -> list[Sample | None]:
        return [self.grid[y][x] for y in range(8)]

    def get_grid(self) -> list[list[Sample | None]]:
        return self.grid

    def __iter__(self):
        for row in self.grid:
            for sample in row:
                yield sample
