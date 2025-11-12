<script lang="ts">
	import { getTagHex } from '$lib/client/utils';
	import { colors } from '$lib/colors';
	import { showAllTagNames } from '$lib/featureFlags';
	import type { SampleSelect, TagSelect } from '$types/db';
	import { selectedSample, libraryModal, tags, tagAttachments, slots } from '$stores/globals';
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

	let currentTime = $state(0);
	let duration = $state(0);

	let max = $derived(duration && Number.isFinite(duration) ? duration : 0);
	let value = $derived(currentTime || 0);

	const sampleTags: TagSelect[] = $derived(
		$tagAttachments
			.filter((ta) => ta.sampleId === sample.id) // Get attachments for this sample
			.map((ta) => $tags.find((t) => t.name === ta.tagName)) // Map to tag objects
			.filter((t): t is TagSelect => t !== undefined) // Filter out undefined tags
	);

	const handleSelect = () => {
		if ($selectedSample?.id === sample.id) {
			$selectedSample = null;
		} else {
			$selectedSample = sample;
		}
	};

	const isUsed = (sampleId: string) => $slots.some((slot) => slot.sampleId === sampleId);
	const sampleColor = () => getTagHex(sample.primaryTagName);

	const isPrimary = (tagName: string) => tagName === sample.primaryTagName;
</script>

<div
	class="sample-item rounded-box bg-base-100 p-4 {$selectedSample?.id === sample.id
		? 'border-2 border-primary'
		: ''} {isUsed(sample.id) ? 'border-b-4' : ''}"
	style={isUsed(sample.id) ? `border-color: ${sampleColor()};` : ''}
>
	<button class="w-full overflow-hidden text-nowrap text-ellipsis" onclick={handleSelect}
		>{sample.name}</button
	>

	<!-- Audio Progress Bar -->
	<progress class="progress progress-primary" {value} {max}></progress>
	<audio bind:this={audioElement} loop bind:currentTime bind:duration preload="auto">
		<source src={`/api/samples/${sample.id}`} type="audio/wav" />
		Your browser does not support the audio element.
	</audio>

	<!-- Controls -->
	<div class="mt-2 grid grid-cols-3">
		<button
			class="btn btn-outline"
			onclick={() => {
				$selectedSample = sample;
				$libraryModal.showModal();
			}}>Edit</button
		>

		<!-- Play Button -->
		<label class="swap">
			<input bind:this={playButton} id="playButton" type="checkbox" onchange={togglePlay} />
			<div class="swap-off">
				<PlayIcon />
			</div>
			<div class="swap-on">
				<CircleStop color="var(--color-primary)" />
			</div>
		</label>
		<div class="flex items-center">
			{#if sample.bpm}
				<span class="mr-1 box-border badge w-fit badge-outline text-nowrap">{sample.bpm} BPM</span>
			{/if}
		</div>
	</div>
	<div class="mb-2"></div>
	<div class="flex h-fit w-full flex-wrap justify-start gap-y-2">
		{#each sampleTags as tag (tag.name)}
			<span
				class="mr-1 badge badge-outline {isPrimary(tag.name) && showAllTagNames
					? 'border-b-4'
					: isPrimary(tag.name)
						? ''
						: 'border-2'}"
				style="border-color: {colors.getHex(tag.color)}; color: {colors.getHex(tag.color)};"
			>
				{isPrimary(tag.name) || showAllTagNames ? tag.name : ''}
			</span>
		{/each}
	</div>
</div>

<style>
	.sample-item {
		text-align: center;
		width: 15rem;
	}
</style>
