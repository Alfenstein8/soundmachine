<script lang="ts">
	import { editTagModal, selectedColor, tags } from '$stores/globals';
	import Modal from '$comp/modal.svelte';
	import * as api from '$lib/client/api';
	import { syncClient, syncTagAttachments, syncTags } from '$lib/client/sync';
	import TagSelectComp from '$comp/tags/tagSelect.svelte';
	import type { TagInsert, TagSelect } from '$types/db';
	import TagInfo from '$comp/tags/tagInfo.svelte';

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

	const handleTagToggle = (tag: TagSelect) => {
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
				ontoggle={handleTagToggle}
				bind:addTagSelected
			/>
		</div>
		<div class="flex items-center justify-center gap-4">
			<TagInfo bind:tagName />
		</div>
		<div class="flex flex-row gap-4">
			{#if addTagSelected}
				<button class="btn grow btn-primary" onclick={handeCreate}>Create</button>
			{:else}
				<button class="btn grow btn-primary" onclick={handleApply}>Apply</button>
				<button class="btn grow btn-warning" onclick={handleDelete}>Delete</button>
			{/if}
		</div>
	</div>
</Modal>
