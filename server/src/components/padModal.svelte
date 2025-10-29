<script lang="ts">
	import Modal from '$comp/modal.svelte';
	import { padModal, selectedSlot } from '$stores/globals';
	import * as api from '$lib/client/api';
	import type { SlotInsert } from '$schema';
	let colorInput: string | undefined = $state();

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
</script>

<Modal bind:dialog={$padModal} title="Edit Pad">
	<div class="flex flex-col gap-4">
		<div class="flex justify-center ">
			<input type="color" class="border-none rounded-full w-16 h-16" bind:value={colorInput} />
		</div>
		<div class="grid grid-cols-2 gap-4">
			<button class="btn btn-primary" onclick={handleApply}>Apply</button>
			<button class="btn btn-warning" onclick={handleRemove}> Remove </button>
		</div>
	</div>
</Modal>
