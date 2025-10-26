<script lang="ts">
	import type { SampleSelect } from '$lib/server/db/schema';
	import UploadButton from './uploadButton.svelte';
	import { placeSample } from '$stores/globals';
	import * as api from '$lib/client/api';

	const { samples }: { samples: SampleSelect[] } = $props();
</script>

<div id="library">
	{#each samples as sample (sample.id)}
		<div class="sample-item">
			<p>{sample.name}</p>
			<audio controls>
				<source src={`/api/sample/${sample.id}`} type="audio/wav" />
				Your browser does not support the audio element.
			</audio>
			<button onclick={() => api.deleteSample(sample.id)}>Delete</button>
			<button onclick={() => ($placeSample = sample)}> Place </button>
		</div>
	{/each}

	<UploadButton />
</div>

<style>
	#library {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}
	.sample-item {
		border: 1px solid #ccc;
		padding: 1rem;
		border-radius: 8px;
		text-align: center;
		width: 15rem;
		height: 15rem;
	}

	audio {
		width: 100%;
		margin-top: 0.5rem;
	}
</style>
