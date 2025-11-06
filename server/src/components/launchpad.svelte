<script lang="ts">
	import type { SlotInsert, SlotSelect } from '$schema';
	import {
		slots,
		samples,
		selectedSample,
		selectedSlot,
		padModal,
		tags,
		shownLayer,
		layers
	} from '$stores/globals';
	import * as api from '$lib/client/api';
	import { syncSlots } from '$lib/client/sync';
	import { colors } from '$lib/colors';
	import { padNumToXY, slotsInLayer } from '$lib/utils';
	import Layers from './layers.svelte';

	$shownLayer = $layers ? $layers[0] : null;

	const getSampleName = (slot: SlotSelect) => {
		return $samples.find((s) => s.id === slot.sampleId)?.name || 'Unknown';
	};

	const handlePadClick = async (slot: SlotSelect) => {
		if ($selectedSample !== null) {
			const tagColor =
				$tags.find((t) => t.name === $selectedSample?.primaryTagName)?.color || undefined;
			try {
				const newSlot: SlotInsert = {
					...slot
				};
				newSlot.sampleId = $selectedSample.id;
				newSlot.color = tagColor;
				await api.updateSlot(slot.id, newSlot);
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
	<div id="launchpad" class="grid grid-cols-8 grid-rows-8 gap-1 sm:gap-2.5">
		{#if $shownLayer}
			{#each slotsInLayer($shownLayer.id, $slots) as slot (slot.id)}
				<button
					class="pad text-base-content hover:bg-base-200 h-7 w-10 rounded-sm sm:h-12 sm:w-20 xl:h-16 xl:w-24 {$selectedSample?.id ===
					slot.sampleId
						? 'selected'
						: ''}"
					style="background-color: {slot.color
						? colors.getHex(slot.color)
						: 'var(--color-base-100)'};
					color: {slot.color ? colors.getContrast(slot.color) : 'black'};
					grid-row: {padNumToXY(slot.position).y};
					grid-column: {padNumToXY(slot.position).x};
					"
					onclick={() => handlePadClick(slot)}
				>
					{#if slot.sampleId !== null}
						{getSampleName(slot)}
					{/if}
				</button>
			{/each}
		{/if}
	</div>
</div>
<Layers />

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
