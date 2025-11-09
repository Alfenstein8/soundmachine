import type {
	LayerInsert,
	LayerSelect,
	SampleInsert,
	SampleSelect,
	SlotInsert,
	SlotSelect,
	tagAttachmentSelect,
	TagInsert,
	TagSelect
} from '$types/db';

const API_URL = '/api';

type NotOk = (res: Response) => boolean;
const fetchRequest = async (endpoint: string, options: RequestInit, notOk: NotOk = () => true) => {
	const res = await fetch(`${API_URL}/${endpoint}`, options);

	if (!res.ok) {
		if (notOk(res)) throw new Error(`API request failed: ${res.statusText}`);
	}

	return res;
};

const getRequest = async (endpoint: string, notOk: NotOk = () => true) =>
	fetchRequest(endpoint, { method: 'GET' }, notOk);

const postRequest = async (endpoint: string, body: BodyInit, notOk: NotOk = () => true) =>
	fetchRequest(endpoint, { method: 'POST', body }, notOk);

const deleteRequest = async (endpoint: string, notOk: NotOk = () => true) =>
	fetchRequest(endpoint, { method: 'DELETE' }, notOk);

const patchRequest = async (endpoint: string, body: BodyInit, notOk: NotOk = () => true) =>
	fetchRequest(endpoint, { method: 'PATCH', body }, notOk);

const putRequest = async (endpoint: string, body: BodyInit, notOk: NotOk = () => true) =>
	fetchRequest(endpoint, { method: 'PUT', body }, notOk);

export const deleteSample = async (id: string) => {
	await deleteRequest(`sample/${id}`, () => {
		alert('Failed to delete sample.');
		return false;
	});
};

export const updateSlot = async (slot: SlotInsert) => {
	const response = await putRequest(
		`layers/${slot.layerId}/${slot.position}`,
		JSON.stringify(slot)
	);
	if (!response.ok) {
		throw new Error(response.statusText);
	}
};

export const deleteSlot = async (layerId: number, position: number) => {
	const response = await deleteRequest(`layers/${layerId}/${position}`);
	if (!response.ok) {
		throw new Error('Failed to delete slot.');
	}
};

export const removeSampleFromSlot = async (layerId: number, position: number) =>
	deleteSlot(layerId, position);

export const uploadSample = async (file: File, sampleData: SampleInsert) => {
	const formData = new FormData();
	formData.append('audio', file);
	formData.append('data', JSON.stringify(sampleData));

	const response = await postRequest('sample', formData);
	if (!response.ok) {
		throw new Error('Failed to upload sample.');
	}

	return response.json() as Promise<SampleSelect>;
};

export const updateSampleMetadata = async (sampleId: string, sample: SampleInsert) => {
	const response = await patchRequest(`sample/${sampleId}`, JSON.stringify(sample));
	if (!response.ok) {
		throw new Error('Failed to update sample metadata.');
	}
};

export const getSampleTags = async (sampleId: string) => {
	const res = await getRequest(`sample/${sampleId}/tags`);

	if (!res.ok) {
		throw new Error('Failed to fetch sample tags.');
	}
	return res.json() as Promise<TagSelect[]>;
};

export const createTag = async (tag: TagInsert) => {
	const response = await postRequest('tags', JSON.stringify(tag));
	if (!response.ok) {
		throw new Error('Failed to create tag.');
	}
};

export const deleteTag = async (tagName: string) => {
	const response = await deleteRequest(`tags/${tagName}`);
	if (!response.ok) {
		throw new Error('Failed to delete tag.');
	}
};

export const updateSampleTags = async (
	sampleId: string,
	tagNames: string[],
	primaryTagName: string | null
) => {
	const requestBody: { tagNames: string[]; primaryTagName: string | null } = {
		tagNames,
		primaryTagName
	};
	const response = await postRequest(`sample/${sampleId}/tags`, JSON.stringify(requestBody));
	if (!response.ok) {
		throw new Error('Failed to create tag.');
	}
};

export const getAllTags = async () => {
	const res = await getRequest('tags');
	if (!res.ok) {
		throw new Error('Failed to fetch tags.');
	}
	return res.json() as Promise<TagSelect[]>;
};

export const getAllSamples = async () => {
	const res = await getRequest('sample');

	if (!res.ok) {
		throw new Error('Failed to fetch samples.');
	}
	return res.json() as Promise<SampleSelect[]>;
};

export const getAllSlots = async () => {
	const res = await getRequest('slot');

	if (!res.ok) {
		throw new Error('Failed to fetch slots.');
	}
	return res.json() as Promise<SlotSelect[]>;
};

export const getAllTagAttachments = async () => {
	const res = await getRequest('tagAttachments');

	if (!res.ok) {
		throw new Error('Failed to fetch tagAttachments.');
	}
	return res.json() as Promise<tagAttachmentSelect[]>;
};

export const getAllLayers = async () => {
	const res = await getRequest('layers');

	if (!res.ok) {
		throw new Error('Failed to fetch layers.');
	}
	return res.json() as Promise<LayerSelect[]>;
};

export const updateTag = async (tagName: string, newTag: TagInsert) => {
	const res = await patchRequest(`tags/${tagName}`, JSON.stringify(newTag));

	if (!res.ok) {
		throw new Error('Failed to update tag.');
	}
};

export const createLayer = async (layer: LayerInsert) => {
	const res = await postRequest('layers', JSON.stringify(layer));

	if (!res.ok) {
		throw new Error('Failed to create layer.');
	}
};

export const updateLayer = async (layerId: number, layer: LayerInsert) => {
	const res = await patchRequest(`layers/${layerId}`, JSON.stringify(layer));
	if (!res.ok) {
		throw new Error('Failed to update layer.');
	}
};

export const deleteLayer = async (layerId: number) => {
	const res = await deleteRequest(`layers/${layerId}`);
	if (!res.ok) {
		throw new Error('Failed to delete layer.');
	}
};
