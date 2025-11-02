<script lang="ts">
	import * as api from '$lib/client/api';
	import Modal from '$comp/modal.svelte';
	import { uploadModal } from '$stores/globals';
	import { onMount } from 'svelte';
	import type { SampleInsert, TagSelect } from '$schema';
	import TagApply from './tagApply.svelte';

	let fileInput: HTMLInputElement;
	let fileName = $state('');
	let bpm: number | null = $state(null);
	let namePlaceholder: string = $state('Enter file name');
	const fileNameInput = (): HTMLInputElement | null => document.querySelector('#nameInput');

	let sampleTags: TagSelect[] = $state([]);
	let primaryTagName: string = $state('Select tag');

	const handeUpload = async () => {
		const files = fileInput.files;

		const trueFileName = fileName || namePlaceholder || 'untitled';
		const newSample: SampleInsert = {
			name: trueFileName,
			bpm: bpm || undefined,
		};

		if (files && files.length > 0) {
			const file = files[0];
			try {
				const resSample  = await api.uploadSample(file, newSample);

				await api.updateSampleTags(
					resSample.id,
					sampleTags.map((t) => t.name),
					sampleTags.find((t) => t.name === primaryTagName) ? primaryTagName : null
				);
			} catch (error) {
				console.error('Error uploading file:', error);
				alert('File upload failed.');
			}
			location.reload();
		}
		console.log('Uploading file:', trueFileName);
	};

	const fileUpdated = () => {
		const input = fileNameInput();
		const file = fileInput.files?.[0];

		if (input) {
			namePlaceholder = file?.name || 'Enter file name';
		}

		const extractedBpm = file ? extractBpmFromFileName(file.name) : null;
		if (extractedBpm !== null) {
			bpm = extractedBpm;
		}
	};

	const extractBpmFromFileName = (fileName: string): number | null => {
		const bpmMatch = fileName.match(/[0-9]+(?=.?bpm)/i);
		console.log(bpm);
		console.log(fileName);
		if (bpmMatch && bpmMatch[0]) {
			return parseInt(bpmMatch[0], 10);
		}
		return null;
	};

	onMount(() => {
		fileUpdated();
	});
</script>

<Modal bind:dialog={$uploadModal} title="Upload Audio Sample">
	<div id="content">
		<input
			type="file"
			accept="audio/*, .wav, .mp3, .ogg, .flac, .aac, .m4a"
			id="fileInput"
			class="file-input"
			name="fileInput"
			bind:this={fileInput}
			onchange={fileUpdated}
		/>

		<div class="flex gap-2">
			<input
				type="text"
				id="nameInput"
				name="nameInput"
				class="textInput input"
				placeholder={namePlaceholder}
				bind:value={fileName}
			/>
			<input
				type="number"
				id="bpmInput"
				name="bpmInput"
				class="textInput input"
				placeholder="BPM"
				bind:value={bpm}
			/>
		</div>
	</div>
		<TagApply bind:sampleTags bind:primaryTagName/>
		<br />
		<button id="uploadButton" class="btn btn-primary" onclick={handeUpload}>Upload</button>
</Modal>

<style>
	#content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	#uploadButton {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
	}
</style>
