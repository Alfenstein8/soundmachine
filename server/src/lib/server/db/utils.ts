import { layers, slots, type LayerInsert, type SlotInsert } from '$schema';
import { db } from '.';

export const createLayer = async (layer: LayerInsert) => {
  const slotsArray: SlotInsert[] = [];
  const res = await db.insert(layers).values(layer).returning();

  // for (let i = 0; i < 8 * 8; i++) {
  //   slotsArray.push({ position: i, layerId: res[0].id });
  // }
  // await db.insert(slots).values(slotsArray);
};
