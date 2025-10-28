<script lang="ts">
	import type { SampleSelect } from '$schema';
	import { selectedSample, placeSample, libraryModal } from '$stores/globals';
	import { CircleStop, PlayIcon } from '@lucide/svelte';

	const { sample }: { sample: SampleSelect } = $props();
	let audioElement: HTMLAudioElement;
	let playButton: HTMLInputElement;

	const togglePlay = () => {
		if (audioElement.paused) {
			audioElement.play();
		} else {
			audioElement.pause();
			audioElement.currentTime = 0;
		}
	};

	const handleAudioChange = () => {
		max = audioElement.duration;
		value = audioElement.currentTime;
	};
	let max: number = $state(100);
	let value: number = $state(0);
</script>

<div class="sample-item rounded-box bg-base-100">
	<p>{sample.name}</p>
	<progress class="progress progress-primary" {value} {max}></progress>
	<audio bind:this={audioElement} loop ontimeupdate={handleAudioChange}>
		<source src={`/api/sample/${sample.id}`} type="audio/wav" />
		Your browser does not support the audio element.
	</audio>
	<div class="mt-2 flex justify-around">
		<button
			class="btn btn-outline"
			onclick={() => {
				$selectedSample = sample;
				$libraryModal.showModal();
			}}>Edit</button
		>
		<label class="swap">
			<input bind:this={playButton} id="playButton" type="checkbox" onchange={togglePlay} />
			<div class="swap-off">
				<PlayIcon />
			</div>
			<div class="swap-on">
				<CircleStop color="var(--color-primary)" />
			</div>
		</label>
		<button class="btn btn-outline" onclick={() => ($placeSample = sample)}> Place </button>
	</div>
</div>

<style>
	.sample-item {
		padding: 1rem;
		text-align: center;
		width: 15rem;
		height: fit-content;
	}

	audio {
		width: 100%;
		margin-top: 0.5rem;
	}
</style>
