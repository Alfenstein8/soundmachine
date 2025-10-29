<script lang="ts">
	import * as api from '$lib/client/api';
	import Modal from '$comp/modal.svelte';
	import { uploadModal } from '$stores/globals';
	import { onMount } from 'svelte';
	import type { SampleInsert } from '$schema';

	let fileInput: HTMLInputElement;
	let fileName = $state('');
	let bpm: number | null = $state(null);
	let namePlaceholder: string = $state('Enter file name');
	const fileNameInput = (): HTMLInputElement | null => document.querySelector('#nameInput');

	const handeUpload = async () => {
		const files = fileInput.files;

		const trueFileName = fileName || namePlaceholder || 'untitled';
		const newSample: SampleInsert = {
			name: trueFileName,
			bpm: bpm || undefined
		};

		if (files && files.length > 0) {
			const file = files[0];
			try {
				await api.uploadSample(file, newSample);
			} catch (error) {
				console.error('Error uploading file:', error);
				alert('File upload failed.');
			}
			location.reload();
		}
		console.log('Uploading file:', trueFileName);
	};

	const changePlaceholder = () => {
		const input = fileNameInput();
		if (input) {
			namePlaceholder = fileInput.files?.[0]?.name || 'Enter file name';
		}
	};

	onMount(() => {
		changePlaceholder();
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
			onchange={changePlaceholder}
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
		<br />
		<button id="uploadButton" class="btn btn-primary" onclick={handeUpload}>Upload</button>
	</div>
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
