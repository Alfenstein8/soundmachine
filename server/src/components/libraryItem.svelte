<script lang="ts">
	import type { SampleSelect, TagSelect } from '$schema';
	import { selectedSample, libraryModal, tags, tagAttachments } from '$stores/globals';
	import Dot from '@lucide/svelte/icons/dot';
	import CircleStop from '@lucide/svelte/icons/circle-stop';
	import PlayIcon from '@lucide/svelte/icons/play';

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
	let max = $state(100);
	let value = $state(0);

	const sampleTags: TagSelect[] = $derived(
		$tagAttachments
			.filter((ta) => ta.sampleId === sample.id) // Get attachments for this sample
			.map((ta) => $tags.find((t) => t.name === ta.tagName)) // Map to tag objects
			.filter((t): t is TagSelect => t !== undefined) // Filter out undefined tags
	);
</script>

<div
	class="sample-item rounded-box bg-base-100 p-4 {$selectedSample?.id === sample.id
		? 'border-2 border-primary'
		: ''}"
>
	<p class="overflow-hidden text-nowrap text-ellipsis">{sample.name}</p>
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
		{#if $selectedSample && $selectedSample.id === sample.id}
			<button class="btn btn-outline" onclick={() => ($selectedSample = null)}>Deselect</button>
		{:else}
			<button class="btn btn-outline" onclick={() => ($selectedSample = sample)}>Select</button>
		{/if}
	</div>
	<div class="mb-2"></div>
	<div class="flex h-fit w-full flex-wrap justify-start gap-y-2">
		{#if sample.bpm}
			<span class="mr-1 box-border badge w-fit badge-outline text-nowrap">{sample.bpm} BPM</span>
		{/if}
		{#each sampleTags as tag (tag.name)}
			<span class="mr-1 badge badge-outline {tag.name === sample.primaryTagName ? "border-b-4":""}" style="border-color: {tag.color}; color: {tag.color};">
				{tag.name}</span
			>
		{/each}
	</div>
</div>

<style>
	.sample-item {
		text-align: center;
		width: 15rem;
	}
</style>
