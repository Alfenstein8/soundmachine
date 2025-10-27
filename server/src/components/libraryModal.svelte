<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { editSampleModal } from '$stores/globals';
	import * as api from '$lib/client/api';

	const handleDelete = async () => {
		if ($editSampleModal == null) return;
		try {
			await api.deleteSample($editSampleModal.id);
			location.reload();
		} catch (error) {
			console.error('Error deleting sample:', error);
			alert('Failed to delete sample.');
		}
	};
</script>

{#if $editSampleModal != null}
	<Modal onClose={() => ($editSampleModal = null)}>
		<h1>Edit Sample</h1>
		<button class="btn" onclick={handleDelete}>Delete</button>
	</Modal>
{/if}
