<script lang="ts">
	import type { SlotSelect } from '$schema';
	import { slots, samples, placeSample, selectedSlot } from '$stores/globals';
	import * as api from '$lib/client/api';

	const getSampleName = (slot: SlotSelect) => {
		return $samples.find((s) => s.id === slot.sampleId)?.name || 'Unknown';
	};

	const handlePadClick = (slot: SlotSelect) => {
		if ($placeSample !== null) {
			api.placeSample($placeSample.id, slot.id.toString());
			$placeSample = null;
		} else if (slot.sampleId !== null) {
			$selectedSlot = slot;
		}
	};
</script>

<div id="launchpadContainer">
	<div id="launchpad">
		{#each $slots as slot (slot.id)}
			<button
				class="pad h-16 w-24 rounded-sm bg-base-300 text-base-content hover:bg-base-200"
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
