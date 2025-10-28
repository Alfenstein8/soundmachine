<script lang="ts">
	import type { SlotSelect } from '$schema';
	import { slots, samples, selectedSample, selectedSlot, padModal } from '$stores/globals';
	import * as api from '$lib/client/api';

	const getSampleName = (slot: SlotSelect) => {
		return $samples.find((s) => s.id === slot.sampleId)?.name || 'Unknown';
	};

	const handlePadClick = (slot: SlotSelect) => {
		if ($selectedSample !== null) {
			api.placeSample($selectedSample.id, slot.id.toString());
			$selectedSample = null;
		} else if (slot.sampleId !== null) {
			$selectedSlot = slot;
			$padModal.showModal();
		}
	};
</script>

<div id="launchpadContainer">
	<div id="launchpad">
		{#each $slots as slot (slot.id)}
			<button
				class="pad h-12 w-20 rounded-sm bg-base-100 text-base-content hover:bg-base-200 xl:h-16 xl:w-24"
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
		height: 100%;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
	}
	#launchpad {
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(8, 1fr);
		gap: 10px;
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
</style>
