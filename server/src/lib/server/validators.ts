import { layers, samples, slots } from '$schema';
import { createInsertSchema } from 'drizzle-valibot';
import { integer, minValue, number, pipe } from 'valibot';
export { parse } from 'valibot';

export const sampleInsertSchema = createInsertSchema(samples);

export const layerInsertSchema = createInsertSchema(layers);

export const slotInsertSchema = createInsertSchema(slots);

export const positionValidator = pipe(number(), integer(), minValue(0));
