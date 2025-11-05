import { BiMap } from './bimap';
export const colors = new BiMap<number, string>();
const colorMap: { [code: number]: string } = {
  0: '#000000',
  5: '#FF292B',
  9: '#FF6D32',
  12: '#FDFA4F',
  20: '#32F846',
  45: '#0E33F6',
  48: '#9766F7',
  53: '#FF40F8'
};

export const availableColorCodes = [5, 9, 12, 20, 45, 48, 53];

availableColorCodes.forEach((code) => {
  colors.set(Number(code), colorMap[code]);
});

export const getColorByCode = (code: number | null): string => {
  if (code === null) return '#FFFFFF';
  return colors.getValue(code) || '#FFFFFF';
};
