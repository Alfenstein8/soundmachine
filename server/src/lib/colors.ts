import { pickRandom } from "./utils";

class Color {
  code: number;
  hex: string;
  contrast: string;
  available: boolean;
  constructor(code: number, hex: string, contrast: string, available = false) {
    this.code = code;
    this.hex = hex;
    this.contrast = contrast;
    this.available = available;
  }
}

class ColorMap {
  colors: Color[] = [];
  availableColors: Color[] = [];
  constructor() {

  }

  add(code: number, hex: string, contrast: string, available = false) {
    this.colors.push(new Color(code, hex, contrast, available));
  }

  getContrast(code: number | null): string {
    if (code === null) return '#000000';
    const color = this.colors.find((c) => c.code === code);
    return color ? color.contrast : '#000000';
  }

  get available() {
    return this.colors.filter((c) => c.available);
  }

  get randomAvailable(): Color {
    return pickRandom(this.available);
  }

  getHex(code: number | null): string {
    if (code === null) return '#FFFFFF';
    const color = this.colors.find((c) => c.code === code);
    return color ? color.hex : '#FFFFFF';
  }

  [Symbol.iterator]() {
    return this.colors.filter((c) => c.available)[Symbol.iterator]();
  }

}
export const colors = new ColorMap();

const c = colors
c.add(0, '#000000', '#FFFFFF');
c.add(3, '#FFFFFF', '#000000');
c.add(5, '#FF292B', '#FFFFFF', true);
c.add(9, '#FF6D32', '#000000', true);
c.add(13, '#FDFA4F', '#000000', true);
c.add(21, '#32F846', '#000000', true);
c.add(101, '#065C1A', '#000000', true);
c.add(37, '#0DB7F9', '#000000', true);
c.add(45, '#0E33F6', '#FFFFFF', true);
c.add(80, '#9766F7', '#000000', true);
c.add(95, '#FF40F8', '#000000', true);
