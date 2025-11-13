import { pickRandom } from './utils';

class Color {
	code: number;
	hex: string;
	contrast: string;
	favorite: Color | undefined;
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
	) {}
	avail() {
		this.colorMap.availableColors.push(this.color);
		return new AddColorResult(this.colorMap, this.color);
	}

	layer() {
		this.colorMap.layerColors.push(this.color);
		return new AddColorResult(this.colorMap, this.color);
	}

	fav(color: Color) {
		this.colorMap.add(color);
		this.color.favorite = color;
		return new AddColorResult(this.colorMap, this.color);
	}
}

class ColorMap {
	colors: Color[] = [];
	availableColors: Color[] = [];
	layerColors: Color[] = [];
	constructor() {}

	add(color: Color) {
		this.colors.push(color);
		return new AddColorResult(this, color);
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

	getFav(code: number): Color | null {
		if (code === null) return null;
		const color = this.colors.find((c) => c.code === code);
		return color && color.favorite ? color.favorite : null;
	}

	[Symbol.iterator]() {
		return this.availableColors[Symbol.iterator]();
	}
}
export const colors = new ColorMap();

const c = colors;

const m = (code: number, hex: string, contrast: string) => new Color(code, hex, contrast);
c.add(m(0, '#000000', '#FFFFFF'));
c.add(m(3, '#FFFFFF', '#000000'));
c.add(m(5, '#FF292B', '#FFFFFF'))
	.avail()
	.fav(m(7, '#6E0A00', '#FFFFFF'));
c.add(m(9, '#FF6D32', '#000000'))
	.avail()
	.fav(m(10, '#6E2900', '#FFFFFF'));
c.add(m(13, '#FDFA4F', '#000000'))
	.avail()
	.fav(m(15, '#6B6900', '#FFFFFF'));
c.add(m(21, '#32F846', '#000000'))
	.avail()
	.fav(m(23, '#006800', '#FFFFFF'));
c.add(m(101, '#065C1A', '#000000'))
	.avail()
	.fav(m(127, '#5D1C00', '#FFFFFF'));
c.add(m(37, '#0DB7F9', '#000000'))
	.avail()
	.fav(m(39, '#005164', '#FFFFFF'));
c.add(m(45, '#0E33F6', '#FFFFFF'))
	.avail()
	.fav(m(47, '#01106E', '#FFFFFF'));
c.add(m(80, '#9766F7', '#000000'))
	.avail()
	.fav(m(51, '#1E137A', '#FFFFFF'));
c.add(m(95, '#FF40F8', '#000000'))
	.avail()
	.fav(m(54, '#6E166D', '#FFFFFF'));

c.add(m(8, '#FFC875', '#000000')).layer();
c.add(m(16, '#8EF836', '#000000')).layer();
c.add(m(24, '#31F857', '#000000')).layer();
c.add(m(32, '#2AF9BE', '#000000')).layer();
c.add(m(40, '#509CFF', '#000000')).layer();
c.add(m(48, '#9766FF', '#000000')).layer();
c.add(m(56, '#FF6896', '#000000')).layer();
c.add(m(4, '#FF6658', '#000000')).layer();
