<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from './uploadButton.svelte';
	import LibraryItem from './libraryItem.svelte';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { newTagModal, removeTagModal, samples, searchTerm, tags } from '$stores/globals';
	import X from '@lucide/svelte/icons/x';
	import { isFirefox, sampleTags } from '$lib/client/utils';
	import Plus from '@lucide/svelte/icons/plus';
	import Minus from '@lucide/svelte/icons/minus';

	const fuse = new Fuse($samples, {
		keys: ['name', 'bpm'],

		findAllMatches: true
	});

	let results: FuseResult<SampleSelect>[] = $state([]);

	let tagFilters: string[] = $state([]);

	let searchCollection: SampleSelect[] = $samples;

	const toggleTagFilter = (tagName: string) => {
		if (tagFilters.includes(tagName)) {
			tagFilters = tagFilters.filter((t) => t !== tagName);
		} else {
			tagFilters.push(tagName);
		}

		if (tagFilters.length === 0) {
			searchCollection = $samples;
			updateResults($searchTerm);
			return;
		}
		searchCollection = $samples.filter((sample) => tagFilters.every(t=>sampleTags(sample.id).some(st=> t === st.name)));
		updateResults($searchTerm);
	};

	const updateResults = (v: string) => {
		if (v.trim() === '') {
			results = searchCollection.map((sample, index) => ({ item: sample, refIndex: index }));
		} else {
			fuse.setCollection(searchCollection);
			results = fuse.search(v);
		}
	};

	samples.subscribe(() => {
		searchCollection = $samples;
		updateResults($searchTerm);
	});

	searchTerm.subscribe((v) => {
		updateResults(v);
	});
</script>

<div class="flex flex-col">
	<div class="flex w-full join justify-center-safe">
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
	<div class="flex flex-wrap gap-1 mt-4 justify-center-safe">
		{#if $tags.length > 0}
			<button
				class="badge badge-outline"
				onclick={() => {
					$removeTagModal.showModal();
				}}
			>
				<Minus />
			</button>
		{/if}
		{#each $tags as tag (tag.name)}
			<button
				class="m-0 badge {tagFilters.includes(tag.name) ? 'badge-outline' : 'badge-ghost'}"
				style="{ tagFilters.includes(tag.name) ? `border-color: ${tag.color};` : ""} color: {tag.color};"
				onclick={() => toggleTagFilter(tag.name)}>{tag.name}</button
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
	<div class="flex overflow-y-scroll flex-wrap gap-4 justify-center-safe">
		{#each results as result (result.item.id)}
			<LibraryItem sample={result.item} />
		{/each}

		<UploadButton />
	</div>
</div>
