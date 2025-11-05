<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { padModal, samples, searchTerm, selectedColor, selectedSlot } from '$stores/globals';
	import * as api from '$lib/client/api';
	import type { SlotInsert } from '$schema';
	import { syncSlots } from '$lib/client/sync';
	import ColorPicker from './colorPicker.svelte';

	selectedSlot.subscribe((newSlot) => {
		if (!newSlot) return;
		if(newSlot?.color) $selectedColor = newSlot.color
	});

	const handleRemove = async () => {
		if (!$selectedSlot) return;
		try {
			await api.removeSampleFromSlot($selectedSlot.id);
			await syncSlots();
			$padModal.close();
		} catch {
			alert('Failed to remove sample from slot.');
		}
		$selectedSlot = null;
	};

	const handleApply = async () => {
		if (!$selectedSlot) return;
		const slotPatch: SlotInsert = {
			color: $selectedColor
		};
		try {
			await api.updateSlot($selectedSlot.id, slotPatch);
			await syncSlots();
			$padModal.close();
		} catch {
			alert('Failed to update slot.');
		}
	};

	const handleShow = () => {
		if (!$selectedSlot) return;
		$searchTerm = $samples.find((s) => s.id == $selectedSlot?.sampleId)?.name ?? '';
		$padModal.close();
	};
</script>

<Modal bind:dialog={$padModal} title="Edit Pad">
	<div class="flex flex-col gap-4">
		<div class="flex justify-center">
			<ColorPicker />
		</div>
		<div class="grid grid-cols-3 gap-4">
			<button class="btn btn-primary" onclick={handleApply}>Apply</button>
			<button class="btn btn-info" onclick={handleShow}>Show</button>
			<button class="btn btn-warning" onclick={handleRemove}> Remove </button>
		</div>
	</div>
</Modal>
