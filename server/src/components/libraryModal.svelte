<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { selectedSample, libraryModal } from '$stores/globals';
	import * as api from '$lib/client/api';
	import type { SampleInsert, TagSelect } from '$schema';
	import { syncSamples, syncSlots, syncTagAttachments } from '$lib/client/sync';
	import TagApply from './tagApply.svelte';

	let nameInput: string = $state('');
	let bpmInput: number | undefined = $state();
	let primaryTagName = $state('Select tag');
	let sampleTags: TagSelect[] = $state([]);

	selectedSample.subscribe(async (newSample) => {
		if (!newSample) return;
		nameInput = newSample.name;
		bpmInput = newSample.bpm ? newSample.bpm : undefined;
		primaryTagName = newSample.primaryTagName ? newSample.primaryTagName : 'Select tag';
		sampleTags = await api.getSampleTags(newSample.id);
	});

	const handleDelete = async () => {
		if ($selectedSample == null) return;
		try {
			await api.deleteSample($selectedSample.id);
			await Promise.all([syncSamples(), syncSlots()]);
			$libraryModal.close();
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

			const newPrimaryTagName = sampleTags.find((t) => t.name === primaryTagName)
				? primaryTagName
				: null;
			await api.updateSampleTags(
				$selectedSample.id,
				sampleTags.map((t) => t.name),
				newPrimaryTagName
			);
			await Promise.all([syncSamples(), syncTagAttachments()]);
			$libraryModal.close();
		} catch (error) {
			console.error('Error updating sample:', error);
			alert('Failed to update sample.');
		}
	};

</script>

<Modal bind:dialog={$libraryModal} title="Edit Sample">
	<div class="flex gap-4">
		<input type="text" class="textInput input mb-4 w-full" bind:value={nameInput} />
		<input
			type="number"
			placeholder="BPM"
			class="textInput input mb-4 w-full"
			bind:value={bpmInput}
		/>
	</div>
	<TagApply bind:primaryTagName bind:sampleTags/>
	<div class="grid grid-cols-2 gap-4">
		<button class="btn btn-primary" onclick={handleApply}>Apply</button>
		<button class="btn btn-warning" onclick={handleDelete}>Delete</button>
	</div>
</Modal>
