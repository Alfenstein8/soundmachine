import { layers, samples, slots, tags, type LayerInsert, type SampleInsert } from '$schema';
import { eq } from 'drizzle-orm';
import { db } from '.';

// Layers
export const createLayer = async (layer: LayerInsert) => {
	await db.insert(layers).values(layer).returning();
};

export const getAllLayers = async () => db.select().from(layers);

// Samples
export const getAllSamples = async () => db.select().from(samples);

export const insertSample = async (sample: SampleInsert) =>
	db.insert(samples).values(sample).returning();

export const deleteSample = async (id: string) => {
	await db.delete(slots).where(eq(slots.sampleId, id));
	await db.delete(samples).where(eq(samples.id, id));
};

export const patchSample = async (sampleId: string, sample: SampleInsert) => {
	if (sample.primaryTagName) {
		const color = await db.select().from(tags).where(eq(tags.name, sample.primaryTagName)).limit(1);

		await db.update(slots).set({ color: color[0].color }).where(eq(slots.sampleId, sampleId));
	}

	await db.update(samples).set(sample).where(eq(samples.id, sampleId));
};

//Slots
export const getAllSlots = async () => db.select().from(slots);
