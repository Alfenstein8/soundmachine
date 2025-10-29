<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from './uploadButton.svelte';
	import LibraryItem from './libraryItem.svelte';
	import Fuse from 'fuse.js';
	import { searchTerm } from '$stores/globals';
	import X from '@lucide/svelte/icons/x';

	const { samples }: { samples: SampleSelect[] } = $props();

	const fuse = new Fuse(samples, {
		keys: ['name', "bpm"],

		findAllMatches: true
	});

	let results = $derived(() => {
		if ($searchTerm.trim() === '') {
			return samples.map((sample, index) => ({ item: sample, refIndex: index }));
		}

		return fuse.search($searchTerm);
	});
</script>

<div class="flex flex-col">
	<div class="flex w-full justify-center-safe join">
		<input
			type="text"
			placeholder="Search samples..."
			bind:value={$searchTerm}
			class="input mb-4 h-10 sm:w-100 w-[80%] border border-base-300 p-2 text-center join-item"
		/>
		<button class="btn join-item" onclick={() => ($searchTerm = '')}>
			<X/>
		</button>
	</div>
	<div class="flex flex-wrap justify-center-safe gap-4 overflow-y-scroll">
		{#each results() as result (result.item.id)}
			<LibraryItem sample={result.item} />
		{/each}

		<UploadButton />
	</div>
</div>
