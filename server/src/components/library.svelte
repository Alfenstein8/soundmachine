<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from './uploadButton.svelte';
	import LibraryItem from './libraryItem.svelte';

	const { samples }: { samples: SampleSelect[] } = $props();
</script>

<div id="library">
	{#each samples as sample (sample.id)}
		<LibraryItem {sample} />
	{/each}

	<UploadButton />
</div>

<style>
	#library {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		overflow-y: scroll;
	}
</style>
