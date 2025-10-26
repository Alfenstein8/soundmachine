import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const samples = sqliteTable('samples', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull()
});

export type SampleSelect = typeof samples.$inferSelect;
export type SampleInsert = typeof samples.$inferInsert;

export const slots = sqliteTable('slots', {
	id: integer('id').primaryKey(),
	sampleId: text('sample_id').references(() => samples.id)
});

export type SlotSelect = typeof slots.$inferSelect;
export type SlotInsert = typeof slots.$inferInsert;
