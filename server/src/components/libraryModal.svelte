<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { selectedSample, libraryModal } from '$stores/globals';
	import * as api from '$lib/client/api';
	import type { SampleInsert } from '$schema';

	let nameInput: string = $state("");
	let bpmInput: number | undefined = $state();

	selectedSample.subscribe((newSample) => {
		if (!newSample) return;
		nameInput = newSample.name;
		bpmInput = newSample.bpm ? newSample.bpm : undefined;
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
			const sample: SampleInsert = { name: nameInput, bpm: bpmInput };
			await api.updateSampleMetadata($selectedSample.id, sample);
			location.reload();
		} catch (error) {
			console.error('Error updating sample:', error);
			alert('Failed to update sample.');
		}
	};
</script>

<Modal bind:dialog={$libraryModal} title="Edit Sample">
	<div class="flex">
	<input type="text" class="mb-4 w-full textInput input" bind:value={nameInput} />
	<input type="number" class="mb-4 w-full textInput input" bind:value={bpmInput} />

	</div>
	<div class="grid grid-cols-2 gap-4">
		<button class="btn btn-primary" onclick={handleApply}>Apply</button>
		<button class="btn btn-warning" onclick={handleDelete}>Delete</button>
	</div>
</Modal>
