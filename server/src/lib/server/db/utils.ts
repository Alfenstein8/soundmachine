import { layers, type LayerInsert } from '$schema';
import { db } from '.';

export const createLayer = async (layer: LayerInsert) => {
  await db.insert(layers).values(layer).returning();
};
