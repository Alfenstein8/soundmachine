<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="h-fit bg-transparent">
	{@render children?.()}
</div>

<style>
	:global(body, html) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
			'Helvetica Neue', sans-serif;
		height: 100%;
		overflow-x: hidden;
		box-sizing: border-box;
		background-color: var(--color-base-300);
	}
</style>
