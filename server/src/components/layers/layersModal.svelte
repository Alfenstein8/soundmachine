<script lang="ts">
	import { syncLayers, syncSlots } from '$lib/client/sync';
	import { layers, layersModal, shownLayer } from '$stores/globals';
	import * as api from '$lib/client/api';
	import Modal from '$comp/modal.svelte';
	import LayersSelect from '$comp/layers/layersSelect.svelte';
	import type { LayerSelect } from '$schema';
	import LayersForm from '$comp/layers/layersForm.svelte';
	import { colors } from '$lib/colors';

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
				name: layerName,
				color: colors.layerColors[$layers.length].code
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
				<button class="btn grow btn-primary" onclick={handleCreate}>Create</button>
			{:else}
				<button class="btn grow btn-primary" onclick={handleApply}>Apply</button>
				{#if $layers.length > 1}
					<button class="btn grow btn-warning" onclick={handleDelete}>Delete</button>
				{/if}
			{/if}
		</div>
	</div>
</Modal>
