import type { SampleInsert, SlotInsert, TagInsert, TagSelect } from '$schema';

export const deleteSample = async (id: string) => {
  const response = await fetch(`/api/sample/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    alert('Failed to delete sample.');
  }
};

export const updateSlot = async (slotId: number, slot: SlotInsert) => {
  fetch(`/api/slot/${slotId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(slot)
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to update slot.');
    }
  });
};

export const placeSample = async (sampleId: string, slotId: number) => {
  updateSlot(slotId, { sampleId, color: '#102457' });
};

export const removeSampleFromSlot = async (slotId: number) =>
  updateSlot(slotId, { sampleId: null, color: null });

export const uploadSample = async (file: File, sampleData: SampleInsert) => {
  const formData = new FormData();
  formData.append('audio', file);
  formData.append('data', JSON.stringify(sampleData));
  const response = await fetch('/api/sample', {
    method: 'POST',
    body: formData
  });
  if (!response.ok) {
    throw new Error('Failed to upload sample.');
  }
};

export const updateSampleMetadata = async (sampleId: string, sample: SampleInsert) => {
  const response = await fetch(`/api/sample/${sampleId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sample)
  });
  if (!response.ok) {
    throw new Error('Failed to update sample metadata.');
  }
};

export const getSampleTags = async (sampleId: string) => {
  const res = await fetch(`/api/sample/${sampleId}/tags`, {
    method: 'GET'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch sample tags.');
  }
  return res.json() as Promise<TagSelect[]>;
};

export const createTag = async (tag: TagInsert) => {

  const response = await fetch('/api/tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tag)
  });
  if (!response.ok) {
    throw new Error('Failed to create tag.');
  }

}

export const updateSampleTags = async (sampleId: string, tags: string[]) => {
  const response = await fetch(`/api/sample/${sampleId}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tags)
  });
  if (!response.ok) {
    throw new Error('Failed to create tag.');
  }

}
