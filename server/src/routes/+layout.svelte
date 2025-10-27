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
		height: 100%;
	}
</style>
