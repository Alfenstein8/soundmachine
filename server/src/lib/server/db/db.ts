import { layers, samples, slots, tags, tagsToSamples } from '$schema';
import { and, eq, getTableColumns, inArray } from 'drizzle-orm';
import { db } from '.';
import type {
	LayerInsert,
	LayerUpdate,
	SampleInsert,
	SampleUpdate,
	SlotInsert,
	tagAttachmentInsert,
	TagInsert,
	TagUpdate
} from '$types/db';
import { colors } from '$lib/colors';

// Layers
export const createLayer = async (layer: LayerInsert) => {
	await db.insert(layers).values(layer).returning();
};

export const getAllLayers = async () => db.select().from(layers);

export const getLayerById = async (id: number) =>
	db
		.select()
		.from(layers)
		.where(eq(layers.id, id))
		.limit(1)
		.then((l) => (l.length > 0 ? l[0] : null));

export const deleteLayer = async (id: number) =>
	Promise.all([
		await db.delete(layers).where(eq(layers.id, id)),
		await db.delete(slots).where(eq(slots.layerId, id))
	]);

export const patchLayer = async (id: number, layer: LayerUpdate) => {
	await db.update(layers).set(layer).where(eq(layers.id, id));

	if (layer.id !== undefined) {
		await db.update(slots).set({ layerId: layer.id }).where(eq(slots.layerId, id));
	}
};
// Samples
export const getAllSamples = async () => db.select().from(samples);

export const insertSample = async (sample: SampleInsert) =>
	db.insert(samples).values(sample).returning();

export const deleteSample = async (id: string) => {
	await db.delete(slots).where(eq(slots.sampleId, id));
	await db.delete(samples).where(eq(samples.id, id));
};

export const patchSample = async (sampleId: string, sample: SampleUpdate) => {
	const tmpSample = await db
		.update(samples)
		.set(sample)
		.where(eq(samples.id, sampleId))
		.returning();
	const newSample = tmpSample[0];
	if (!newSample.primaryTagName) return;

	if (sample.primaryTagName || sample.favorite != undefined) {
		const temp = await db
			.select()
			.from(tags)
			.where(eq(tags.name, newSample.primaryTagName))
			.limit(1);
		let color = temp[0].color;

		if (newSample.favorite) {
			color = colors.getFav(color)?.code || color;
		}

		await db.update(slots).set({ color: color }).where(eq(slots.sampleId, sampleId));
	}
};

// Slots
export const getAllSlots = async () => db.select().from(slots);

export const putSlot = async (slot: SlotInsert) => {
	const layer = await getLayerById(slot.layerId);
	if (layer === null) {
		return new Response('Layer not found', { status: 404 });
	}
	await db
		.insert(slots)
		.values(slot)
		.onConflictDoUpdate({
			target: [slots.layerId, slots.position],
			set: slot
		});
};

export const deleteSlot = async (layerId: number, position: number) =>
	db.delete(slots).where(and(eq(slots.layerId, layerId), eq(slots.position, position)));

// Tags
export const getAllTags = async () => db.select().from(tags);

export const insertTag = async (tag: TagInsert) => db.insert(tags).values(tag).returning();

export const deleteAllTags = async () => {
	Promise.all([
		await db.delete(tagsToSamples),
		await db.delete(tags),
		await db.update(samples).set({ primaryTagName: null })
	]);
};

export const deleteTagByName = async (tagName: string) => {
	Promise.all([
		await db.delete(tagsToSamples).where(eq(tagsToSamples.tagName, tagName)),
		await db.delete(tags).where(eq(tags.name, tagName)),
		await db
			.update(samples)
			.set({ primaryTagName: null })
			.where(eq(samples.primaryTagName, tagName))
	]);
};

export const patchTagByName = async (oldTagName: string, newTag: TagUpdate) => {
	const affectedSamples = await db
		.select()
		.from(samples)
		.where(eq(samples.primaryTagName, oldTagName));
	const nonFavSampleIds = affectedSamples.filter((s) => !s.favorite).map((s) => s.id);
	const favSampleIds = affectedSamples.filter((s) => s.favorite).map((s) => s.id);
	const favColor = newTag.color ? (colors.getFav(newTag.color)?.code ?? 5) : 5;

	await Promise.all([
		await db
			.update(slots)
			.set({ color: newTag.color })
			.where(and(eq(slots.useTagColor, true), inArray(slots.sampleId, nonFavSampleIds))),
		await db
			.update(slots)
			.set({ color: favColor })
			.where(and(eq(slots.useTagColor, true), inArray(slots.sampleId, favSampleIds))),
		await db.update(tags).set(newTag).where(eq(tags.name, oldTagName)),
		await db
			.update(tagsToSamples)
			.set({ tagName: newTag.name })
			.where(eq(tagsToSamples.tagName, oldTagName)),
		await db
			.update(samples)
			.set({ primaryTagName: newTag.name })
			.where(eq(samples.primaryTagName, oldTagName))
	]);
};

export const getTagsBySampleId = async (sampleId: string) =>
	db
		.select({ ...getTableColumns(tags) })
		.from(tagsToSamples)
		.innerJoin(tags, eq(tagsToSamples.tagName, tags.name))
		.where(eq(tagsToSamples.sampleId, sampleId));

// TagAttachments
export const getAllTagAttachments = async () => db.select().from(tagsToSamples);

export const deleteTagAttachmentsBySampleId = async (sampleId: string) =>
	db.delete(tagsToSamples).where(eq(tagsToSamples.sampleId, sampleId));

export const putTagAttachments = async (TagAttachments: tagAttachmentInsert[]) =>
	db
		.insert(tagsToSamples)
		.values(TagAttachments)
		.onConflictDoUpdate({
			target: [tagsToSamples.tagName, tagsToSamples.sampleId],
			set: tagsToSamples
		})
		.returning();
