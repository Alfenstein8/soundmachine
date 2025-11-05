<script lang="ts">
	import type { SlotSelect } from '$schema';
	import { slots, samples, selectedSample, selectedSlot, padModal, tags } from '$stores/globals';
	import * as api from '$lib/client/api';
	import { syncSlots } from '$lib/client/sync';
	import { colors, getColorByCode } from '$lib/colors';

	const getSampleName = (slot: SlotSelect) => {
		return $samples.find((s) => s.id === slot.sampleId)?.name || 'Unknown';
	};

	const handlePadClick = async (slot: SlotSelect) => {
		if ($selectedSample !== null) {
			const tagColor = $tags.find((t) => t.name === $selectedSample?.primaryTagName)
				?.color || undefined;
			try {
				await api.placeSample($selectedSample.id, slot.id, tagColor);
				$selectedSample = null;
				await syncSlots();
			} catch (error) {
				console.error('Error placing sample:', error);
				alert('Failed to place sample.');
			}
		} else if (slot.sampleId !== null) {
			$selectedSlot = slot;
			$padModal.showModal();
		}
	};
</script>

<div id="launchpadContainer">
	<div id="launchpad" class="gap-1 sm:gap-2.5">
		{#each $slots as slot (slot.id)}
			<button
				class="pad h-7 w-10 rounded-sm text-base-content hover:bg-base-200 sm:h-12 sm:w-20 xl:h-16 xl:w-24 {$selectedSample?.id ===
				slot.sampleId
					? 'selected'
					: ''}"
				style="background-color: {slot.color ? getColorByCode(slot.color) : 'var(--color-base-100)'}; color: {slot.color ? colors.getContrast(slot.color) : "black"} "
				onclick={() => handlePadClick(slot)}
			>
				{#if slot.sampleId !== null}
					{getSampleName(slot)}
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	#launchpadContainer {
		display: flex;
		justify-content: center;
		align-items: center;
		height: fit-content;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
	}
	#launchpad {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
		width: fit-content;
		height: fit-content;
	}
	.pad {
		cursor: pointer;
		padding: 0px;
		text-align: center;
		text-overflow: ellipsis;
		overflow: hidden;
	}

	.selected {
		border: 3px solid var(--color-primary);
	}
</style>
