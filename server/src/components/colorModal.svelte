<script lang="ts">
	import { colors } from '$lib/colors';
	import { colorModal, selectedColor } from '$stores/globals';
	import Modal from './modal.svelte';
</script>

<Modal bind:dialog={$colorModal}>
	<div class="flex flex-row justify-center gap-2 align-middle">
		{#each colors as c (c)}
			<button
				class="btn btn-circle"
				style="background-color: {c.hex};"
				aria-label={c.hex}
				onclick={() => {
					$selectedColor = c.code;
					$colorModal.close();
				}}
			></button>
		{/each}
	</div>
</Modal>
