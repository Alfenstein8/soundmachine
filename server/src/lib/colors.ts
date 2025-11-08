import { pickRandom } from './utils';

class Color {
  code: number;
  hex: string;
  contrast: string;
  constructor(code: number, hex: string, contrast: string) {
    this.code = code;
    this.hex = hex;
    this.contrast = contrast;
  }
}

class AddColorResult {
  constructor(
    private colorMap: ColorMap,
    private color: Color
  ) { }
  available() {
    this.colorMap.availableColors.push(this.color);
    return new AddColorResult(this.colorMap, this.color);
  }

  layer() {
    this.colorMap.layerColors.push(this.color);
    return new AddColorResult(this.colorMap, this.color);
  }
}

class ColorMap {
  colors: Color[] = [];
  availableColors: Color[] = [];
  layerColors: Color[] = [];
  constructor() { }

  add(code: number, hex: string, contrast: string) {
    this.colors.push(new Color(code, hex, contrast));

    return new AddColorResult(this, this.colors[this.colors.length - 1]);
  }

  getContrast(code: number | null): string {
    if (code === null) return '#000000';
    const color = this.colors.find((c) => c.code === code);
    return color ? color.contrast : '#000000';
  }

  get randomAvailable(): Color {
    return pickRandom(this.availableColors);
  }

  getHex(code: number | null): string {
    if (code === null) return '#FFFFFF';
    const color = this.colors.find((c) => c.code === code);
    return color ? color.hex : '#FFFFFF';
  }

  [Symbol.iterator]() {
    return this.availableColors[Symbol.iterator]();
  }
}
export const colors = new ColorMap();

const c = colors;
c.add(0, '#000000', '#FFFFFF');
c.add(3, '#FFFFFF', '#000000');
c.add(5, '#FF292B', '#FFFFFF').available();
c.add(9, '#FF6D32', '#000000').available();
c.add(13, '#FDFA4F', '#000000').available();
c.add(21, '#32F846', '#000000').available();
c.add(101, '#065C1A', '#000000').available();
c.add(37, '#0DB7F9', '#000000').available();
c.add(45, '#0E33F6', '#FFFFFF').available();
c.add(80, '#9766F7', '#000000').available();
c.add(95, '#FF40F8', '#000000').available();

c.add(8, '#FFC875', '#000000').layer();
c.add(16, '#8EF836', '#000000').layer();
c.add(24, '#31F857', '#000000').layer();
c.add(32, '#2AF9BE', '#000000').layer();
c.add(40, '#509CFF', '#000000').layer();
c.add(48, '#9766FF', '#000000').layer();
c.add(56, '#FF6896', '#000000').layer();
c.add(4, '#FF6658', '#000000').layer();
