import type { tagUpdateSchema, layerUpdateSchema } from '$lib/server/validators';
import { layers, samples, slots, tags, tagsToSamples } from '$schema';
import type { InferInput } from 'valibot';

export type SampleSelect = typeof samples.$inferSelect;
export type SampleInsert = typeof samples.$inferInsert;

export type LayerInsert = typeof layers.$inferInsert;
export type LayerUpdate = InferInput<typeof layerUpdateSchema>;
export type LayerSelect = typeof layers.$inferSelect;

export type SlotSelect = typeof slots.$inferSelect;
export type SlotInsert = typeof slots.$inferInsert;

export type TagSelect = typeof tags.$inferSelect;
export type TagUpdate = InferInput<typeof tagUpdateSchema>;
export type TagInsert = typeof tags.$inferInsert;

export type tagAttachmentSelect = typeof tagsToSamples.$inferSelect;
export type tagAttachmentInsert = typeof tagsToSamples.$inferInsert;
