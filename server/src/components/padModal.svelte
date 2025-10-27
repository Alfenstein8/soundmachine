<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { selectedSlot } from '$stores/globals';
	import * as api from '$lib/client/api';
	let dialog: HTMLDialogElement;

	const handleRemove = async () => {
		if ($selectedSlot) {
			try {
				await api.removeSampleFromSlot($selectedSlot.id.toString());
			} catch {
				alert('Failed to remove sample from slot.');
			}
			$selectedSlot = null;
		}
	};
</script>

<Modal bind:dialog>
	<button onclick={handleRemove}> Remove </button>
</Modal>
