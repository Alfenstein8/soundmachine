<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { theme } from '$stores/theme';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div data-theme={$theme}>
{@render children?.()}
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		height: 100vh;
		background-color: var(--color-background);
	}

	:global(.btn) {
		background-color: var(--color-button-bg);
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		transition: background-color 0.3s ease;
		width: fit-content;
		height: fit-content;
	}
	:global(.btn:hover) {
		background-color: var(--color-button-bg-hover);
	}

	:global(.textInput) {
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 16px;
		width: 100%;
		box-sizing: border-box;
	}
</style>
