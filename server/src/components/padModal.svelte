<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { padModal, samples, searchTerm, selectedSlot } from '$stores/globals';
	import * as api from '$lib/client/api';
	import type { SlotInsert } from '$schema';
	let colorInput: string | undefined = $state();

	selectedSlot.subscribe((newSlot) => {
		if (!newSlot) return;
		colorInput = newSlot.color || '#ffffff';
	});

	const handleRemove = async () => {
		if (!$selectedSlot) return;
		try {
			await api.removeSampleFromSlot($selectedSlot.id);
		} catch {
			alert('Failed to remove sample from slot.');
		}
		$selectedSlot = null;
	};

	const handleApply = async () => {
		if (!$selectedSlot) return;
		const slotPatch: SlotInsert = {
			color: colorInput
		};
		try {
			api.updateSlot($selectedSlot.id, slotPatch);
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
			<input type="color" class="h-16 w-16 rounded-full border-none" bind:value={colorInput} />
		</div>
		<div class="grid grid-cols-3 gap-4">
			<button class="btn btn-primary" onclick={handleApply}>Apply</button>
			<button class="btn btn-info" onclick={handleShow}>Show</button>
			<button class="btn btn-warning" onclick={handleRemove}> Remove </button>
		</div>
	</div>
</Modal>
