import type { SampleInsert, SampleSelect, TagSelect } from '$schema';

export const deleteSample = async (id: string) => {
  const response = await fetch(`/api/sample/${id}`, {
    method: 'DELETE'
  });
  if (response.ok) {
    location.reload();
  } else {
    alert('Failed to delete sample.');
  }
};

export const placeSample = (sampleId: string, slotId: string) => {
  fetch(`/api/sample/${sampleId}/place`, {
    method: 'POST',
    body: slotId
  }).then((response) => {
    if (response.ok) {
      location.reload();
    } else {
      alert('Failed to place sample in slot.');
    }
  });
};

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

export const removeSampleFromSlot = async (slotId: string) => {
  fetch(`/api/slot/${slotId}`, {
    method: 'POST'
  }).then((response) => {
    if (response.ok) {
      location.reload();
    } else {
      throw new Error('Failed to remove sample from slot.');
    }
  });
};

export const updateSampleMetadata = async (sample: SampleSelect) => {
  const response = await fetch(`/api/sample/${sample.id}`, {
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
}
