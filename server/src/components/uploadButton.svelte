<script lang="ts">
  import { showUploadModal } from '$stores/globals';
</script>

<div id="uploadButton">
	<button class="btn" onclick={() => $showUploadModal = true}>Upload File</button>
</div>

<style>
  #uploadButton {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
</style>
