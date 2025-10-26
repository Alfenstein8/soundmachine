<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { editPadModal } from '$stores/globals';
	import * as api from '$lib/client/api';

	const handleRemove = async () => {
		if ($editPadModal) {
			try {
				await api.removeSampleFromSlot($editPadModal.id.toString());
			} catch {
				alert('Failed to remove sample from slot.');
			}
			$editPadModal = null;
		}
	};
</script>

{#if $editPadModal !== null}
	<Modal>
		<button onclick={handleRemove}> Remove </button>
		<button onclick={() => ($editPadModal = null)}> Close </button>
	</Modal>
{/if}
