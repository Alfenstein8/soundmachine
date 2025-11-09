<script lang="ts">
	import { colors } from '$lib/colors';
	import type { TagSelect } from '$types/db';
	import Plus from '@lucide/svelte/icons/plus';

	let {
		tags,
		selectedTags = $bindable(),
		ontoggle = () => {},
		multiSelect = true,
		onAddButton,
		addTagSelected = $bindable()
	}: {
		tags: TagSelect[];
		selectedTags: TagSelect[];
		ontoggle?: (tag: TagSelect) => void;
		multiSelect?: boolean;
		onAddButton?: (selected: boolean) => void;
		addTagSelected?: boolean;
	} = $props();

	const toggle = (tag: TagSelect) => {
		if (selectedTags.find((t) => t.name === tag.name)) {
			selectedTags = selectedTags.filter((t) => t.name !== tag.name);
		} else {
			if (multiSelect) {
				selectedTags.push(tag);
			} else {
				selectedTags = [tag];
			}
			toggleAddTag(false);
		}

		ontoggle(tag);
	};

	const toggleAddTag = (selected = !addTagSelected) => {
		if (addTagSelected == undefined) return;
		selectedTags = selected ? [] : selectedTags;
		addTagSelected = selected;
		if (!onAddButton) return;
		onAddButton(selected);
	};
</script>

{#each tags as tag (tag.name)}
	<button
		class="m-0 badge {selectedTags.find((t) => t.name === tag.name)
			? 'badge-outline'
			: 'badge-ghost'}"
		style="{selectedTags.find((t) => tag.name === t.name)
			? `border-color: ${colors.getHex(tag.color)};`
			: ''} color: {colors.getHex(tag.color)};"
		onclick={() => toggle(tag)}>{tag.name}</button
	>
{/each}

{#if onAddButton || addTagSelected != undefined}
	<button
		class="m-0 badge {addTagSelected ? 'badge-outline' : 'badge-ghost'}"
		onclick={() => toggleAddTag()}
	>
		<Plus />
	</button>
{/if}
