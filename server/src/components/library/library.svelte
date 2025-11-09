<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from '$comp/uploadButton.svelte';
	import LibraryItem from '$comp/library/libraryItem.svelte';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { editTagModal, samples, searchTerm, tags } from '$stores/globals';
	import X from '@lucide/svelte/icons/x';
	import { isSampleUsed, sampleTags } from '$lib/client/utils';
	import Tag from '@lucide/svelte/icons/tag';
	import TagSelectComp from '$comp/tags/tagSelect.svelte';
	import type { TagSelect } from '$lib/server/db/schema';
	import Filters from '$comp/library/filters.svelte';

	const fuse = new Fuse($samples, {
		keys: ['name', 'bpm'],

		findAllMatches: true
	});

	let showUsed = $state(true);

	let results: FuseResult<SampleSelect>[] = $state([]);

	let selectedTags: TagSelect[] = $state([]);

	let searchCollection: SampleSelect[] = $samples;

	const updateResults = (v: string = $searchTerm) => {
		searchCollection = $samples;

		if (!showUsed) {
			searchCollection = searchCollection.filter((sample) => !isSampleUsed(sample.id));
		}
		if (selectedTags.length >= 0) {
			searchCollection = searchCollection.filter((sample) =>
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

<div class="flex flex-col items-center">
	<div class="join flex w-full justify-center-safe">
		<input
			type="text"
			placeholder="Search samples..."
			bind:value={$searchTerm}
			class="input join-item h-10 w-[80%] border border-base-300 p-2 text-center sm:w-100"
		/>
		<button class="btn join-item" onclick={() => ($searchTerm = '')}>
			<X />
		</button>
	</div>
	<div
		class="sticky top-0 z-50 mt-2 flex w-fit flex-wrap items-center justify-center-safe gap-1 rounded-box bg-base-300 p-2"
	>
		<button
			class="btn btn-circle btn-ghost"
			onclick={() => {
				$editTagModal.showModal();
			}}
		>
			<Tag />
		</button>
		<TagSelectComp tags={$tags} bind:selectedTags ontoggle={() => updateResults($searchTerm)} />
		<Filters bind:showUsed onchange={() => updateResults()} />
	</div>
	<br class="mb-4" />
	<div class="flex flex-wrap justify-center-safe gap-4">
		{#each results as result (result.item.id)}
			<LibraryItem sample={result.item} />
		{/each}

		<UploadButton />
	</div>
</div>
