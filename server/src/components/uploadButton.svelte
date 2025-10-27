<script lang="ts">
	import UploadModal from '$comp/uploadModal.svelte';
	let dialog: HTMLDialogElement;
</script>

<div id="uploadButton">
	<button class="btn btn-primary" onclick={() => dialog.showModal()}>Upload File</button>
	<UploadModal bind:dialog />
</div>

<style>
	#uploadButton {
		position: fixed;
		bottom: 20px;
		right: 20px;
	}
</style>
