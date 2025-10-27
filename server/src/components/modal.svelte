<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from './closeButton.svelte';
	let { children, dialog = $bindable() }: { children?: Snippet; dialog: HTMLDialogElement } = $props();
</script>

<dialog bind:this={dialog} class="modal">
	<div class="modal-box">
		<CloseButton onClick={() => dialog.close()} />
		{@render children?.()}
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
