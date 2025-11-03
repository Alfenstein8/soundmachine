<script lang="ts">
	import type { TagSelect } from '$schema';

	let {
		tags,
		selectedTags = $bindable(),
		ontoggle = () => {},
		multiSelect = true
	}: {
		tags: TagSelect[];
		selectedTags: TagSelect[];
		ontoggle?: (tag: TagSelect) => void;
		multiSelect?: boolean;
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
		}

		ontoggle(tag);
	};
</script>

{#each tags as tag (tag.name)}
	<button
		class="badge m-0 {selectedTags.find((t) => t.name === tag.name)
			? 'badge-outline'
			: 'badge-ghost'}"
		style="{selectedTags.find((t) => tag.name === t.name)
			? `border-color: ${tag.color};`
			: ''} color: {tag.color};"
		onclick={() => toggle(tag)}>{tag.name}</button
	>
{/each}
