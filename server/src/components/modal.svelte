<script lang="ts">
	import type { Snippet } from 'svelte';
	import CloseButton from './closeButton.svelte';
	const { children, onClose = () => {} }: { children: Snippet; onClose?: () => void } = $props();
</script>

<div id="background">
	<div id="modal">
		<div id="header">
			<CloseButton onClick={onClose} />
		</div>
		<div id="content">
			{@render children()}
		</div>
	</div>
</div>

<style>
	#background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	#modal {
		background-color: white;
		border-radius: 8px;
		text-align: center;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
	}

	#header {
		display: flex;
		justify-content: flex-end;
		padding: 0.5rem;
		height: fit-content;
		width: 100%;
	}

	#content {
		padding: 0rem 1rem 1rem 1rem;
	}
</style>
