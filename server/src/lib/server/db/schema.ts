import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const samples = sqliteTable('samples', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
});

export const slots = sqliteTable('slots', {
	id: integer('id').primaryKey(),
	sampleId: text('sample_id')
		.references(() => samples.id)
});
