<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { editPadModal } from '$stores/globals';
</script>

{#if $editPadModal !== null}
	<Modal>
		<button onclick={() => ($editPadModal = null)}> Close </button>
	</Modal>
{/if}
