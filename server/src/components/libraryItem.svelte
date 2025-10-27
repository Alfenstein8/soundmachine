<script lang="ts">
	import type { SampleSelect } from '$schema';
	import { selectedSample, placeSample, libraryModal } from '$stores/globals';

	const { sample }: { sample: SampleSelect } = $props();
</script>

<div class="sample-item">
	<p>{sample.name}</p>
	<audio controls loop>
		<source src={`/api/sample/${sample.id}`} type="audio/wav" />
		Your browser does not support the audio element.
	</audio>
	<button
		class="btn"
		onclick={() => {
			$selectedSample = sample;
			$libraryModal.showModal();
		}}>Edit</button
	>
	<button class="btn" onclick={() => ($placeSample = sample)}> Place </button>
</div>

<style>
	.sample-item {
		border: 1px solid #ccc;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		width: 15rem;
		height: fit-content;
		background-color: var(--color-);
	}

	audio {
		width: 100%;
		margin-top: 0.5rem;
	}

	.btn {
		padding: 0.5rem;
	}
</style>
