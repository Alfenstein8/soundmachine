import type { SlotSelect } from '$schema';

export const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const padNumToXY = (num: number) => {
  return { x: num % 8 +1, y: Math.floor(num / 8)+1 };
};

export const slotsInLayer = (layerId: number, slots: SlotSelect[]): SlotSelect[] =>
  slots.filter((s) => s.layerId === layerId);
