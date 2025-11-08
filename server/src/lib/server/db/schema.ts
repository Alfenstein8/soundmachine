import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const samples = sqliteTable('samples', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	bpm: integer('bpm'),
	primaryTagName: text('primary_tag_name').references(() => tags.name)
});

export const samplesRelations = relations(samples, ({ many }) => ({
	tagsToSamples: many(tagsToSamples)
}));

export type SampleSelect = typeof samples.$inferSelect;
export type SampleInsert = typeof samples.$inferInsert;

export const layers = sqliteTable('layers', {
	id: integer('id').primaryKey(),
	name: text('name').notNull()
});

export type LayerInsert = typeof layers.$inferInsert;
export type LayerSelect = typeof layers.$inferSelect;

export const slots = sqliteTable(
	'slots',
	{
		position: integer('position').notNull(),
		layerId: integer('layerId')
			.notNull()
			.references(() => layers.id),
		sampleId: text('sample_id').notNull().references(() => samples.id),
		color: integer('color').notNull().default(5),
		useTagColor: integer({ mode: 'boolean' }).notNull().default(true)
	},
	(table) => [primaryKey({ columns: [table.layerId, table.position] })]
);
export type SlotSelect = typeof slots.$inferSelect;
export type SlotInsert = typeof slots.$inferInsert;

export const tags = sqliteTable('tags', {
	name: text('name').primaryKey(),
	color: integer('color')
});

export type TagSelect = typeof tags.$inferSelect;
export type TagInsert = typeof tags.$inferInsert;

export const tagsRelations = relations(tags, ({ many }) => ({
	tagsToSamples: many(tagsToSamples)
}));

export const tagsToSamples = sqliteTable(
	'tags_to_samples',
	{
		tagName: text('tag_name')
			.notNull()
			.references(() => tags.name),
		sampleId: text('sample_id')
			.notNull()
			.references(() => samples.id)
	},
	(t) => [primaryKey({ columns: [t.tagName, t.sampleId] })]
);

export type tagAttachmentSelect = typeof tagsToSamples.$inferSelect;
export type tagAttachmentInsert = typeof tagsToSamples.$inferInsert;
