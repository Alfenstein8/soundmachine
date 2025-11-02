<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from './uploadButton.svelte';
	import LibraryItem from './libraryItem.svelte';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { newTagModal, searchTerm, tags } from '$stores/globals';
	import X from '@lucide/svelte/icons/x';
	import { isFirefox } from '$lib/client/utils';
	import Plus from '@lucide/svelte/icons/plus';

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
	<div class="join flex w-full justify-center-safe">
		<input
			type="text"
			placeholder="Search samples..."
			bind:value={$searchTerm}
			class="input join-item h-10 w-[80%] border border-base-300 p-2 text-center sm:w-100"
		/>
		{#if isFirefox()}
			<button class="btn join-item" onclick={() => ($searchTerm = '')}>
				<X />
			</button>
		{/if}
	</div>
	<div class="mt-4 flex flex-wrap justify-center-safe">
		{#each $tags as tag (tag.name)}
			<span class="mr-1 badge badge-outline" style="border-color: {tag.color}; color: {tag.color};"
				>{tag.name}</span
			>
		{/each}
		<button
			class="badge badge-outline"
			onclick={() => {
				$newTagModal.showModal();
			}}
		>
			<Plus />
		</button>
	</div>
	<br class="mb-4" />
	<div class="flex flex-wrap justify-center-safe gap-4 overflow-y-scroll">
		{#each results as result (result.item.id)}
			<LibraryItem sample={result.item} />
		{/each}

		<UploadButton />
	</div>
</div>
