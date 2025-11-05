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
				style="background-color: {c[1]};"
				aria-label={c[1]}
				onclick={() => {
					$selectedColor = c[0];
					$colorModal.close();
				}}
			></button>
		{/each}
	</div>
</Modal>
