<script lang="ts">
  import { showUploadModal } from '$stores/globals';
</script>

<div id="uploadButton">
	<button on:click={() => $showUploadModal = true}>Upload File</button>
</div>

<style>
  #uploadButton {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
  }
  button:hover {
    background-color: #0056b3;
  }

</style>
