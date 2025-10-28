<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { selectedSample, libraryModal } from '$stores/globals';
	import * as api from '$lib/client/api';
	import type { SampleSelect } from '$schema';

	let nameInput: string;

	selectedSample.subscribe((newSample) => {
		nameInput = newSample ? newSample.name : '';
	});

	const handleDelete = async () => {
		if ($selectedSample == null) return;
		try {
			await api.deleteSample($selectedSample.id);
			location.reload();
		} catch (error) {
			console.error('Error deleting sample:', error);
			alert('Failed to delete sample.');
		}
	};

	const handleApply = async () => {
		if ($selectedSample == null) return;
		try {
			const sample: SampleSelect = { ...$selectedSample };
			sample.name = nameInput;
			await api.updateSampleMetadata(sample);
			location.reload();
		} catch (error) {
			console.error('Error updating sample:', error);
			alert('Failed to update sample.');
		}
	};
</script>

<Modal bind:dialog={$libraryModal} title="Edit Sample">
	<input type="text" class="mb-4 w-full textInput input" bind:value={nameInput} />
	<div class="grid grid-cols-2 gap-4">
		<button class="btn btn-primary" onclick={handleApply}>Apply</button>
		<button class="btn btn-warning" onclick={handleDelete}>Delete</button>
	</div>
</Modal>
