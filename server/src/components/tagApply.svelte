<script lang="ts">
	import { colors } from '$lib/colors';
	import type { TagSelect } from '$schema';
	import { tags } from '$stores/globals';

	let {
		primaryTagName = $bindable(),
		sampleTags = $bindable()
	}: { primaryTagName?: string; sampleTags: TagSelect[] } = $props();

	let tagInput: string = $state('Add tag');

	const handleTagAdd = () => {
		const tagToAdd = $tags.find((t) => t.name === tagInput);
		if (!tagToAdd) {
			primaryTagName = 'Select tag';
			return;
		}
		sampleTags.push(tagToAdd);
		if (primaryTagName === 'Select tag') {
			primaryTagName = tagToAdd.name;
		}
	};

	const getTagColor = (tagName: string | undefined) => {
		return colors.getHex($tags.find((t) => t.name === tagName)?.color ?? 5);
	};

	const handleTagRemove = (tagName: string) => {
		sampleTags = sampleTags.filter((t) => t.name !== tagName);
	};
</script>

<fieldset class="mb-2 fieldset">
	<legend class="fieldset-legend">Tags</legend>
	<div class="flex">
		{#each sampleTags as tag (tag.name)}
			<span
				class="mr-1 badge badge-outline"
				style="border-color: {colors.getHex(tag.color)}; color: {colors.getHex(tag.color)};"
				>{tag.name}
				<button onclick={() => handleTagRemove(tag.name)}> &times; </button>
			</span>
		{/each}
		<select class="badge badge-outline" bind:value={tagInput} onchange={handleTagAdd}>
			<option disabled selected>Add tag</option>
			{#each $tags as tag (tag.name)}
				{#if sampleTags.findIndex((t) => t.name === tag.name) === -1}
					<option>{tag.name}</option>
				{/if}
			{/each}
		</select>
	</div>
</fieldset>
<fieldset class="mb-2 fieldset">
	<legend class="fieldset-legend">Primary Tag</legend>
	<select
		class="badge badge-outline"
		style="border-color: {getTagColor(primaryTagName)}; color: {getTagColor(primaryTagName)};"
		bind:value={primaryTagName}
	>
		<option disabled selected>Select tag</option>
		{#each sampleTags as tag (tag.name)}
			<option style="color: initial" >{tag.name}</option>
		{/each}
	</select>
</fieldset>
