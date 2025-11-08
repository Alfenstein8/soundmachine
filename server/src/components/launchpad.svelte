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
	import Layers from './layers.svelte';

	$shownLayer = $layers ? $layers[0] : null;

	const getSampleName = (slot: SlotSelect) => {
		return $samples.find((s) => s.id === slot.sampleId)?.name || 'Unknown';
	};

	const handlePadClick = async (slot: SlotSelect) => {
		if (slot.sampleId === null) return;
		$selectedSlot = slot;
		$padModal.showModal();
	};

	const handleEmptyPadClick = async (position: number) => {
		if ($selectedSample !== null && $shownLayer !== null) {
			const tagColor =
				$tags.find((t) => t.name === $selectedSample?.primaryTagName)?.color || undefined;
			try {
				const newSlot: SlotInsert = {
					position,
					layerId: $shownLayer.id,
					color: tagColor,
					sampleId: $selectedSample.id
				};
				await api.updateSlot(newSlot);
				$selectedSample = null;
				await syncSlots();
			} catch (error) {
				console.error('Error placing sample:', error);
				alert('Failed to place sample.');
			}
		}
	};
</script>

<div id="launchpadContainer">
	<div
		id="launchpad"
		class="grid h-80 w-100 grid-cols-8 grid-rows-8 gap-1 sm:h-100 sm:w-150 sm:gap-2.5 lg:h-140 lg:w-200"
	>
		{#if $shownLayer}
			{#each { length: 64 } as _, i (i)}
				{@const slot = $slots.find((s) => s.position === i && s.layerId === $shownLayer.id)}
				{#if slot}
					<button
						class="pad rounded-sm text-base-content hover:bg-base-200 {$selectedSample?.id ===
						slot.sampleId
							? 'selected'
							: ''}"
						style="background-color: {colors.getHex(slot.color)};
					  color: {colors.getContrast(slot.color)};
					  "
						onclick={() => handlePadClick(slot)}
					>
						{#if slot.sampleId !== null}
							{getSampleName(slot)}
						{/if}
					</button>
				{:else}
					<button
						class="pad rounded-sm bg-base-100"
						onclick={()=>handleEmptyPadClick(i)}
						aria-label={`${i} position`}
					></button>
				{/if}
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
