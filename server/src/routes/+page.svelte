<script lang="ts">
	import Library from '$comp/library.svelte';
	import Launchpad from '$comp/launchpad.svelte';
	import { samples, slots, tagAttachments, tags } from '$stores/globals.js';
	import LibraryModal from '$comp/libraryModal.svelte';
	import UploadModal from '$comp/uploadModal.svelte';
	import PadModal from '$comp/padModal.svelte';
	import EditTagModal from '$comp/editTagModal.svelte';
	import ColorModal from '$comp/colorModal.svelte';
	let { data } = $props();

	$slots = data.slots;
	$samples = data.samples;
	$tags = data.tags;
	$tagAttachments = data.tagAttachments;
</script>

<LibraryModal />
<UploadModal />
<PadModal />
<EditTagModal />
<ColorModal />

<!-- <ChooseTheme /> -->
<div id="split" class="flex flex-col">
	<Launchpad />
	<Library />
</div>
