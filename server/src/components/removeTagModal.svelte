<script lang="ts">
	import { removeTagModal, tags } from '$stores/globals';
	import Modal from './modal.svelte';
	import * as api from '$lib/client/api';

	let removeTagName = $state('');

	const handleDelete = async () => {
		if (!removeTagName) {
			alert('Please select a tag to remove.');
			return;
		}
		try {
			api.deleteTag(removeTagName);
			$removeTagModal.close();
		} catch (error) {
			console.error('Error deleting tag:', error);
			alert('Failed to delete tag.');
		}
	};
</script>

<Modal bind:dialog={$removeTagModal} title="Remove Tag">
	<fieldset class="mb-2 fieldset">
		<legend class="fieldset-legend">Remove Tag</legend>
		<select class="badge badge-outline" bind:value={removeTagName}>
			<option disabled selected>Select tag</option>
			{#each $tags as tag (tag.name)}
				<option>{tag.name}</option>
			{/each}
		</select>
	</fieldset>

	<div class="grid grid-cols-2 gap-4">
		<button class="btn btn-warning" onclick={handleDelete}>Delete</button>
	</div>
</Modal>
