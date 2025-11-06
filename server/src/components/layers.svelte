<script>
	import { layers, shownLayer } from '$stores/globals';
	import * as api from '$lib/client/api';
	import { syncLayers, syncSlots } from '$lib/client/sync';

	const handleAddLayer = async () => {
		await api.createLayer({
			id: $layers.reduce((max, layer) => (layer.id > max ? layer.id : max), 0) + 1,
			name: 'New Layer'
		});
		Promise.all([await syncLayers(), await syncSlots()]);
	};
</script>

<div class="mb-4 flex justify-center align-middle gap-1 flex-wrap">
	{#each $layers as layer (layer.id)}
		<button class="btn {$shownLayer?.id === layer.id ? "btn-outline" : ""} w-fit" onclick={()=>$shownLayer = layer}>
			{layer.name}
		</button>
	{/each}

	{#if $layers.length < 8}
		<button class="btn" onclick={handleAddLayer}> + </button>
	{/if}
</div>
