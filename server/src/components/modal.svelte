<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from './closeButton.svelte';
	let {
		children,
		dialog = $bindable(),
		title
	}: { children?: Snippet; dialog: HTMLDialogElement; title?: string } = $props();
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box flex flex-col justify-center">
		<div class="btn absolute top-2 right-2 btn-circle btn-ghost btn-sm">
			<CloseButton onClick={() => dialog.close()} />
		</div>
		{#if title}
			<div class="m-4 flex justify-center">
				<h2 class="text-lg font-bold">{title}</h2>
			</div>
		{/if}
		{@render children?.()}
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
