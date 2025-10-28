<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from './uploadButton.svelte';
	import LibraryItem from './libraryItem.svelte';

	const { samples }: { samples: SampleSelect[] } = $props();
</script>

<div id="library" class="overflow-y-scroll flex gap-4 flex-wrap justify-center-safe">
	{#each samples as sample (sample.id)}
		<LibraryItem {sample} />
	{/each}

	<UploadButton />
</div>
