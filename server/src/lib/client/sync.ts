import { tags, samples, slots, tagAttachments, layers } from '$stores/globals';
import * as api from '$lib/client/api';

let syncInterval: NodeJS.Timeout;
const interval = 10000;

export const startPeriodicSync = () => {
	syncInterval = setInterval(() => {
		syncClient();
	}, interval);
};

export const stopPeriodicSync = () => {
	clearInterval(syncInterval);
};

export const syncClient = async () => {
	await Promise.all([syncTags(), syncSamples(), syncSlots(), syncTagAttachments(), syncLayers()]);
};

export const syncTags = async () => {
	const newTags = await api.getAllTags();
	tags.set(newTags);
};

export const syncSamples = async () => {
	const newSamples = await api.getAllSamples();
	samples.set(newSamples);
};

export const syncSlots = async () => {
	const newSlots = await api.getAllSlots();
	slots.set(newSlots);
};

export const syncTagAttachments = async () => {
	const newTagAttachments = await api.getAllTagAttachments();
	tagAttachments.set(newTagAttachments);
};

export const syncLayers = async () => {
	const newLayers = await api.getAllLayers();
	layers.set(newLayers);
};
