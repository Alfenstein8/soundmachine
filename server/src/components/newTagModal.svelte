<script lang="ts">
	import { newTagModal } from '$stores/globals';
	import Modal from './modal.svelte';
	import * as api from '$lib/client/api';

	let tagName = $state('');
	let tagColor = $state('#ffffff');

	const handeUpload = async () => {
		api.createTag({ name: tagName, color: tagColor });

		$newTagModal.close();
		location.reload();
	};
</script>

<Modal bind:dialog={$newTagModal} title="Create Tag">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2 justify-center-safe">
			<input type="color" class="h-16 w-16 rounded-full border-none" bind:value={tagColor} />
			<input type="text" class="textInput input" placeholder="Tag Name" bind:value={tagName} />
		</div>
		<button id="uploadButton" class="btn btn-primary" onclick={handeUpload}>Upload</button>
	</div>
</Modal>
