<script lang="ts">
	import * as api from '$lib/client/api';
	import Modal from '$comp/modal.svelte';
	import { uploadModal } from '$stores/globals';
	import { onMount } from 'svelte';

	let fileInput: HTMLInputElement;
	let fileName: string = $state('');
	let namePlaceholder: string = $state('Enter file name');
	const fileNameInput = (): HTMLInputElement | null => document.querySelector('#nameInput');

	const handeUpload = async () => {
		const files = fileInput.files;

		const trueFileName = fileName || namePlaceholder || 'untitled';

		if (files && files.length > 0) {
			const file = files[0];
			try {
				await api.uploadSample(file, trueFileName);
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
			accept="audio/*"
			id="fileInput"
			class="file-input"
			name="fileInput"
			bind:this={fileInput}
			onchange={changePlaceholder}
		/>

		<input
			type="text"
			id="nameInput"
			class="textInput input"
			placeholder={namePlaceholder}
			bind:value={fileName}
		/>
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
	#nameInput {
		margin-top: 0.5rem;
		padding: 0.5rem;
		width: 80%;
	}
	#uploadButton {
		margin-top: 1rem;
		padding: 0.5rem 1rem;
	}
</style>
