<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { selectedSample } from '$stores/globals';
	import * as api from '$lib/client/api';

	let { dialog = $bindable() }: { dialog: HTMLDialogElement } = $props();

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
</script>

<Modal bind:dialog>
	<h1>Edit Sample</h1>
	<button class="btn" onclick={handleDelete}>Delete</button>
</Modal>
