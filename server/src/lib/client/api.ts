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
