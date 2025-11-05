<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from '$comp/uploadButton.svelte';
	import LibraryItem from './libraryItem.svelte';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { newTagModal, editTagModal, samples, searchTerm, tags } from '$stores/globals';
	import X from '@lucide/svelte/icons/x';
	import { isFirefox, sampleTags } from '$lib/client/utils';
	import Plus from '@lucide/svelte/icons/plus';
	import Tag from '@lucide/svelte/icons/tag';
	import TagSelectComp from './tagSelect.svelte';
	import type { TagSelect } from '$lib/server/db/schema';

	const fuse = new Fuse($samples, {
		keys: ['name', 'bpm'],

		findAllMatches: true
	});

	let results: FuseResult<SampleSelect>[] = $state([]);

	let selectedTags: TagSelect[] = $state([]);

	let searchCollection: SampleSelect[] = $samples;

	const updateResults = (v: string) => {
		if (selectedTags.length === 0) {
			searchCollection = $samples;
		} else {
			searchCollection = $samples.filter((sample) =>
				selectedTags.every((t) => sampleTags(sample.id).some((st) => t.name === st.name))
			);
		}
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
	<div class="join justify-center-safe flex w-full">
		<input
			type="text"
			placeholder="Search samples..."
			bind:value={$searchTerm}
			class="input join-item border-base-300 sm:w-100 h-10 w-[80%] border p-2 text-center"
		/>
		<button class="btn join-item" onclick={() => ($searchTerm = '')}>
			<X />
		</button>
	</div>
	<div class="justify-center-safe mt-4 flex flex-wrap items-center gap-1">
		{#if $tags.length > 0}
			<button
				class="btn btn-circle btn-ghost"
				onclick={() => {
					$editTagModal.showModal();
				}}
			>
				<Tag />
			</button>
		{/if}
		<TagSelectComp tags={$tags} bind:selectedTags ontoggle={() => updateResults($searchTerm)} />
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
	<div class="justify-center-safe flex flex-wrap gap-4 overflow-y-scroll">
		{#each results as result (result.item.id)}
			<LibraryItem sample={result.item} />
		{/each}

		<UploadButton />
	</div>
</div>
