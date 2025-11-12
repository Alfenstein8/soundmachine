import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const samples = sqliteTable('samples', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	bpm: integer('bpm'),
	primaryTagName: text('primary_tag_name').references(() => tags.name),
	favorite: integer({ mode: 'boolean' }).notNull().default(false)
});

export const samplesRelations = relations(samples, ({ many }) => ({
	tagsToSamples: many(tagsToSamples)
}));

export const layers = sqliteTable('layers', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	color: integer('color').notNull().default(8)
});

export const slots = sqliteTable(
	'slots',
	{
		position: integer('position').notNull(),
		layerId: integer('layerId')
			.notNull()
			.references(() => layers.id),
		sampleId: text('sample_id')
			.notNull()
			.references(() => samples.id),
		color: integer('color').notNull().default(5),
		useTagColor: integer({ mode: 'boolean' }).notNull().default(true)
	},
	(table) => [primaryKey({ columns: [table.layerId, table.position] })]
);

export const tags = sqliteTable('tags', {
	name: text('name').primaryKey(),
	color: integer('color').notNull().default(13)
});

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
