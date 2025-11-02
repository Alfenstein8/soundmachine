<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { selectedSample, libraryModal, tags } from '$stores/globals';
	import * as api from '$lib/client/api';
	import type { SampleInsert, TagSelect } from '$schema';

	let nameInput: string = $state('');
	let bpmInput: number | undefined = $state();
	let tagInput: string = $state('Add tag');

	let sampleTags: TagSelect[] = $state([]);

	selectedSample.subscribe(async (newSample) => {
		if (!newSample) return;
		sampleTags = await api.getSampleTags(newSample.id);
	});

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
			await api.updateSampleTags($selectedSample.id, sampleTags.map((t) => t.name));
			location.reload();
		} catch (error) {
			console.error('Error updating sample:', error);
			alert('Failed to update sample.');
		}
	};

	const handleTagAdd = () => {
		const tagToAdd = $tags.find((t) => t.name === tagInput);
		if (!tagToAdd) return;
		sampleTags.push(tagToAdd);
	};

	const handleTagRemove = (tagName: string) => {
		sampleTags = sampleTags.filter((t) => t.name !== tagName);
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
	<fieldset class="mb-2 fieldset">
		<legend class="fieldset-legend">Tags</legend>
		<div class="flex">
			{#each sampleTags as tag (tag.name)}
				<span
					class="mr-1 badge badge-outline"
					style="border-color: {tag.color}; color: {tag.color};"
					>{tag.name}
					<button onclick={() => handleTagRemove(tag.name)}> &times; </button>
				</span>
			{/each}
			<select class="badge badge-outline" bind:value={tagInput} onchange={handleTagAdd}>
				<option disabled selected>Add tag</option>
				{#each $tags as tag (tag.name)}
					{#if sampleTags.findIndex((t) => t.name === tag.name) === -1}
						<option>{tag.name}</option>
					{/if}
				{/each}
			</select>
		</div>
	</fieldset>
	<div class="grid grid-cols-2 gap-4">
		<button class="btn btn-primary" onclick={handleApply}>Apply</button>
		<button class="btn btn-warning" onclick={handleDelete}>Delete</button>
	</div>
</Modal>
