import { layers, samples, slots, tagsToSamples } from '$schema';
import { createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import { integer, minValue, number, pipe } from 'valibot';
export { parse } from 'valibot';

export const sampleInsertSchema = createInsertSchema(samples);
export const sampleUpdateSchema = createUpdateSchema(samples);

export const layerInsertSchema = createInsertSchema(layers);
export const layerUpdateSchema = createUpdateSchema(layers);

export const slotInsertSchema = createInsertSchema(slots);

export const positionValidator = pipe(number(), integer(), minValue(0));

export const tagInsertSchema = createInsertSchema(layers);
export const tagUpdateSchema = createUpdateSchema(layers);

export const tagAttachmentInsertSchema = createInsertSchema(tagsToSamples);
