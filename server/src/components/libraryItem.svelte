<script lang="ts">
	import type { SampleSelect, TagSelect } from '$schema';
	import { selectedSample, libraryModal } from '$stores/globals';
	import CircleStop from '@lucide/svelte/icons/circle-stop';
	import PlayIcon from '@lucide/svelte/icons/play';
	import * as api from '$lib/client/api';
	import { onMount } from 'svelte';

	const { sample }: { sample: SampleSelect } = $props();
	let tags: TagSelect[] = $state([]);
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
	let max = $state(100);
	let value = $state(0);

	onMount(async ()=> {
	    tags = await api.getSampleTags(sample.id);
	  });
</script>

<div class="sample-item rounded-box bg-base-100 p-4 {$selectedSample?.id === sample.id ? 'border-2 border-primary' : ''}">
	<div id="tags" class="mb-2 flex justify-end m-0 h-4">
		{#if sample.bpm}
			<span class="badge badge-outline mr-1">{sample.bpm} BPM</span>
		{/if}
		{#each tags as tag (tag.name)}
			<span class="badge badge-outline mr-1">{tag.name}</span>
		{/each}

	</div>
	<p class="text-nowrap overflow-hidden text-ellipsis">{sample.name}</p>
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
		<button class="btn btn-outline" onclick={() => ($selectedSample = sample)}> Select</button>
	</div>
</div>

<style>
	.sample-item {
		text-align: center;
		width: 15rem;
		height: fit-content;
	}

	audio {
		width: 100%;
		margin-top: 0.5rem;
	}
</style>
