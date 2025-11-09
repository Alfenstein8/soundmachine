<script lang="ts">
	import type { LayerSelect } from '$types/db';
	import { layers } from '$stores/globals';

	let {
		selected = $bindable(),
		onadd,
		ontoggle,
		addButtonSelected = $bindable()
	}: {
		selected: LayerSelect | null;
		onadd?: (layer: boolean) => void;
		ontoggle?: (layer: LayerSelect) => void;
		addButtonSelected?: boolean;
	} = $props();

	const clickLayer = (layer: LayerSelect) => {
		selected = layer;
		handleAddButton(false);
	};

	const handleAddButton = (isSelected = !addButtonSelected) => {
		if (addButtonSelected == undefined) return;
		addButtonSelected = isSelected;
		selected = isSelected ? null : selected;
		if (!onadd) return;
		onadd(isSelected);
	};
</script>

{#each $layers as layer (layer.id)}
	<button
		class="btn {selected?.id === layer.id ? 'btn-outline' : ''} w-fit"
		onclick={() => {
			clickLayer(layer);
			if (ontoggle) ontoggle(layer);
		}}
	>
		{layer.name}
	</button>
{/each}
{#if $layers.length < 8 && (onadd || addButtonSelected != undefined)}
	<button
		class="btn {addButtonSelected ? 'btn-outline' : ''}"
		onclick={() => handleAddButton(true)}
	>
		+
	</button>
{/if}
