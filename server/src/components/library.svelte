<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from './uploadButton.svelte';
	import LibraryItem from './libraryItem.svelte';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { searchTerm } from '$stores/globals';
	import X from '@lucide/svelte/icons/x';

	const { samples }: { samples: SampleSelect[] } = $props();

	const fuse = new Fuse(samples, {
		keys: ['name', 'bpm'],

		findAllMatches: true
	});

	let results: FuseResult<SampleSelect>[] = $state([]);

	searchTerm.subscribe((v) => {
		if (v.trim() === '') {
			results = samples.map((sample, index) => ({ item: sample, refIndex: index }));
		} else {
			results = fuse.search(v);
		}
	});
</script>

<div class="flex flex-col">
	<div class="flex w-full join justify-center-safe">
		<input
			type="text"
			placeholder="Search samples..."
			bind:value={$searchTerm}
			class="input join-item mb-4 h-10 w-[80%] border border-base-300 p-2 text-center sm:w-100"
		/>
		{#if navigator.userAgent.search("Firefox") > -1}
		<button class="btn join-item" onclick={() => ($searchTerm = '')}>
			<X />
		</button>
		{/if}
	</div>
	<div class="flex overflow-y-scroll flex-wrap gap-4 justify-center-safe">
		{#each results as result (result.item.id)}
			<LibraryItem sample={result.item} />
		{/each}

		<UploadButton />
	</div>
</div>
