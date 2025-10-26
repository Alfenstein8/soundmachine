<script lang="ts">
	import { showUploadModal } from '$stores/globals';
	import Modal from '$comp/modal.svelte';

	let fileInput: HTMLInputElement;
	let fileName: string;
	const fileNameInput = (): HTMLInputElement | null => document.querySelector('#nameInput');

	const handeUpload = async () => {
		const files = fileInput.files;

		const trueFileName = fileName || fileNameInput()?.placeholder || 'untitled';

		if (files && files.length > 0) {
			const file = files[0];
			const formData = new FormData();
			formData.append('audio', file);
			formData.append('name', trueFileName);
			const response = await fetch('/api/sample', {
				method: 'POST',
				body: formData
			});
			if (response.ok) {
				location.reload();
			} else {
				alert('File upload failed.');
			}
		}
		console.log('Uploading file:', trueFileName);
	};

	const changePlaceholder = () => {
		const input = fileNameInput();
		if (input) {
			input.placeholder = fileInput.files?.[0]?.name || 'Enter file name';
		}
	};
</script>

{#if $showUploadModal}
	<Modal>
		<h2>Upload Audio File</h2>
		<input type="file" id="fileInput" bind:this={fileInput} onchange={changePlaceholder} />
		<input type="text" id="nameInput" placeholder="Enter file name" bind:value={fileName} />
		<br />
		<button id="uploadButton" onclick={handeUpload}>Upload</button>
		<button id="closeButton" onclick={() => ($showUploadModal = false)}>Close</button>
	</Modal>
{/if}
