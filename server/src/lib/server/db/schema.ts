import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const samples = sqliteTable('samples', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull()
});

export const samplesRelations = relations(samples, ({ many }) => ({
	tagsToSamples: many(tagsToSamples)
}));

export type SampleSelect = typeof samples.$inferSelect;
export type SampleInsert = typeof samples.$inferInsert;

export const slots = sqliteTable('slots', {
	id: integer('id').primaryKey(),
	sampleId: text('sample_id').references(() => samples.id)
});
export type SlotSelect = typeof slots.$inferSelect;
export type SlotInsert = typeof slots.$inferInsert;

export const tags = sqliteTable('tags', {
	name: text('name').primaryKey()
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

