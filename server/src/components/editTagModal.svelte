<script lang="ts">
	import { editTagModal, selectedColor, tags } from '$stores/globals';
	import Modal from './modal.svelte';
	import * as api from '$lib/client/api';
	import { syncClient, syncTagAttachments, syncTags } from '$lib/client/sync';
	import TagSelectComp from './tagSelect.svelte';
	import type { TagInsert, TagSelect } from '$schema';
	import TagInfo from './tagInfo.svelte';
	import { Plus } from '@lucide/svelte';

	let selectedTags: TagSelect[] = $state([]);
	let tagName = $state('');
	let addTagSelected = $state(false);

	const handleDelete = async () => {
		if (selectedTags.length === 0) {
			alert('Please select a tag to remove.');
			return;
		}
		try {
			await api.deleteTag(selectedTags[0].name);
			await Promise.all([syncTags(), syncTagAttachments()]);
			$editTagModal.close();
		} catch (error) {
			console.error('Error deleting tag:', error);
			alert('Failed to delete tag.');
		}
	};

	const handleApply = async () => {
		if (selectedTags.length === 0) {
			alert('Please select a tag to Edit.');
			return;
		}
		try {
			const newTag: TagInsert = {
				name: tagName,
				color: $selectedColor
			};
			await api.updateTag(selectedTags[0].name, newTag);
			await syncClient();
			$editTagModal.close();
		} catch {
			alert('Failed to update tag.');
			return;
		}
	};

	const handeCreate = async () => {
		await api.createTag({ name: tagName, color: $selectedColor });

		Promise.all([syncTags(), syncTagAttachments()]);
		$editTagModal.close();
	};

	const handleToggle = (tag: TagSelect) => {
		tagName = tag.name;
		if (tag.color) $selectedColor = tag.color;
	};
</script>

<Modal bind:dialog={$editTagModal} title="Edit Tag">
	<div class="flex flex-col gap-4">
		<div class="flex w-full flex-wrap justify-center gap-y-2">
			<TagSelectComp
				tags={$tags}
				bind:selectedTags
				multiSelect={false}
				ontoggle={handleToggle}
				bind:addTagSelected
			/>
		</div>
		<div class="flex items-center justify-center gap-4">
			<TagInfo bind:tagName />
		</div>
		<div class="flex flex-row gap-4">
			{#if addTagSelected}
				<button class="btn btn-primary grow" onclick={handeCreate}>Create</button>
			{:else}
				<button class="btn btn-primary grow" onclick={handleApply}>Apply</button>
				<button class="btn btn-warning grow" onclick={handleDelete}>Delete</button>
			{/if}
		</div>
	</div>
</Modal>
