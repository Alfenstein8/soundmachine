<script lang="ts">
	import { editTagModal, selectedColor, tags } from '$stores/globals';
	import Modal from './modal.svelte';
	import * as api from '$lib/client/api';
	import { syncClient, syncTagAttachments, syncTags } from '$lib/client/sync';
	import TagSelectComp from './tagSelect.svelte';
	import type { TagInsert, TagSelect } from '$schema';
	import TagInfo from './tagInfo.svelte';

	let selectedTags: TagSelect[] = $state([]);
	let tagName = $state('');

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
				color: $selectedColor?.[0]
			};
			await api.updateTag(selectedTags[0].name, newTag);
			await syncClient();
			$editTagModal.close();
		} catch {
			alert('Failed to update tag.');
			return;
		}
	};

	const handleToggle = (tag: TagSelect) => {
		tagName = tag.name;
	};
</script>

<Modal bind:dialog={$editTagModal} title="Remove Tag">
	<div class="flex flex-col gap-4">
		<div class="flex w-full flex-wrap justify-center gap-y-2">
			<TagSelectComp tags={$tags} bind:selectedTags multiSelect={false} ontoggle={handleToggle} />
		</div>
		<div class="flex items-center justify-center gap-4">
			<TagInfo bind:tagName />
		</div>
		<div class="grid grid-cols-2 gap-4">
			<button class="btn btn-primary" onclick={handleApply}>Apply</button>
			<button class="btn btn-warning" onclick={handleDelete}>Delete</button>
		</div>
	</div>
</Modal>
