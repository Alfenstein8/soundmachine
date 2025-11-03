<script lang="ts">
	import { newTagModal } from '$stores/globals';
	import Modal from './modal.svelte';
	import * as api from '$lib/client/api';
	import { syncTagAttachments, syncTags } from '$lib/client/sync';
	import TagInfo from './tagInfo.svelte';

	let tagName = $state('');
	let tagColor = $state('#ffffff');

	const handeUpload = async () => {
		await api.createTag({ name: tagName, color: tagColor });

		Promise.all([syncTags(), syncTagAttachments()]);
		$newTagModal.close();
	};
</script>

<Modal bind:dialog={$newTagModal} title="Create Tag">
	<div class="flex flex-col gap-2">
		<div class="flex items-center justify-center-safe gap-2">
			<TagInfo bind:tagName bind:tagColor/>
		</div>
		<button id="uploadButton" class="btn btn-primary" onclick={handeUpload}>Upload</button>
	</div>
</Modal>
