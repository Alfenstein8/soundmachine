<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { padModal, selectedSlot } from '$stores/globals';
	import * as api from '$lib/client/api';

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

<Modal bind:dialog={$padModal}>
	<button onclick={handleRemove}> Remove </button>
</Modal>
