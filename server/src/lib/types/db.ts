import { layers, samples, slots, tags, tagsToSamples } from '$schema';

export type SampleSelect = typeof samples.$inferSelect;
export type SampleInsert = typeof samples.$inferInsert;

export type LayerInsert = typeof layers.$inferInsert;
export type LayerSelect = typeof layers.$inferSelect;

export type SlotSelect = typeof slots.$inferSelect;
export type SlotInsert = typeof slots.$inferInsert;

export type TagSelect = typeof tags.$inferSelect;
export type TagInsert = typeof tags.$inferInsert;

export type tagAttachmentSelect = typeof tagsToSamples.$inferSelect;
export type tagAttachmentInsert = typeof tagsToSamples.$inferInsert;
