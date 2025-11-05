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

class ColorMap {
  colors: Color[] = [];
  constructor() {

  }

  add(code: number, hex: string, contrast: string) {
    this.colors.push(new Color(code, hex, contrast));
  }

  getContrast(code: number | null): string {
    if (code === null) return '#000000';
    const color = this.colors.find((c) => c.code === code);
    return color ? color.contrast : '#000000';
  }

  getHex(code: number | null): string {
    if (code === null) return '#FFFFFF';
    const color = this.colors.find((c) => c.code === code);
    return color ? color.hex : '#FFFFFF';
  }

  [Symbol.iterator]() {
    return this.colors[Symbol.iterator]();
  }

}
export const colors = new ColorMap();

colors.add(0, '#000000', '#FFFFFF');
colors.add(5, '#FF292B', '#FFFFFF');
colors.add(9, '#FF6D32', '#000000');
colors.add(12, '#FDFA4F', '#000000');
colors.add(20, '#32F846', '#000000');
colors.add(45, '#0E33F6', '#FFFFFF');
colors.add(48, '#9766F7', '#000000');
colors.add(53, '#FF40F8', '#000000');

export const availableColorCodes = [5, 9, 12, 20, 45, 48, 53];

export const getColorByCode = (code: number | null): string =>
  colors.getHex(code);

