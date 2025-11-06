<script lang="ts">
	import { syncLayers, syncSlots } from '$lib/client/sync';
	import { layers, layersModal, shownLayer } from '$stores/globals';
	import * as api from '$lib/client/api';
	import Modal from './modal.svelte';
	import LayersSelect from './layersSelect.svelte';
	import type { LayerSelect } from '$schema';
	import LayersForm from './layersForm.svelte';

	let selectedLayer: LayerSelect | null = $state($shownLayer);
	let addButtonSelected: boolean = $state(false);

	let layerName = $state($shownLayer ? $shownLayer.name : '');

	const checkForOne = () => {
		if (!$layers.find((l) => l.id === $shownLayer?.id) && $layers.length > 0) {
			$shownLayer = $layers[0];
		}
	};

	const handleCreate = async () => {
		try {
			await api.createLayer({
				id: $layers.reduce((max, layer) => (layer.id > max ? layer.id : max), 0) + 1,
				name: layerName
			});
			await Promise.all([await syncLayers(), await syncSlots()]);
			checkForOne();
			$layersModal.close();
		} catch (error) {
			console.error('Error creating layer:', error);
			alert('Failed to create layer.');
		}
	};

	const handleApply = async () => {
		if (!selectedLayer) {
			alert('Please select a layer to edit.');
			return;
		}
		try {
			await api.updateLayer(selectedLayer.id, {
				name: layerName
			});
			await Promise.all([await syncLayers(), await syncSlots()]);
			checkForOne();
			$layersModal.close();
		} catch (error) {
			console.error('Error updating layer:', error);
			alert('Failed to update layer.');
		}
	};

	const handleDelete = async () => {
		if (!selectedLayer) {
			alert('Please select a layer to remove.');
			return;
		}
		try {
			await api.deleteLayer(selectedLayer.id);
			await Promise.all([await syncLayers(), await syncSlots()]);
			checkForOne();
			$layersModal.close();
		} catch (error) {
			console.error('Error deleting layer:', error);
			alert('Failed to delete layer.');
		}
	};

	const onToggle = (layer: LayerSelect) => {
		layerName = layer.name;
	};
</script>

<Modal bind:dialog={$layersModal} title="Layers">
	<div class="flex flex-col gap-5">
		<div class="flex flex-wrap justify-center gap-1 align-middle">
			<LayersSelect bind:selected={selectedLayer} bind:addButtonSelected ontoggle={onToggle} />
		</div>
		<div class="flex justify-center">
			<LayersForm bind:name={layerName} />
		</div>
		<div class="flex flex-row gap-4">
			{#if addButtonSelected}
				<button class="btn btn-primary grow" onclick={handleCreate}>Create</button>
			{:else}
				<button class="btn btn-primary grow" onclick={handleApply}>Apply</button>
				<button class="btn btn-warning grow" onclick={handleDelete}>Delete</button>
			{/if}
		</div>
	</div>
</Modal>
