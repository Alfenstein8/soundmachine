<script lang="ts">
	import UploadModal from '$comp/uploadModal.svelte';
	import { uploadModal } from '$stores/globals';
</script>

<div id="uploadButton">
	<button class="btn btn-primary" onclick={() => $uploadModal.showModal()}>Upload File</button>
	<UploadModal />
</div>

<style>
	#uploadButton {
		position: fixed;
		bottom: 20px;
		right: 20px;
	}
</style>
