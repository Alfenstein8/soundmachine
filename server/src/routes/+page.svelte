<script lang="ts">
	import Library from '$comp/library.svelte';
	import Launchpad from '$comp/launchpad.svelte';
	import { samples, slots, tags } from '$stores/globals.js';
	import LibraryModal from '$comp/libraryModal.svelte';
	import UploadModal from '$comp/uploadModal.svelte';
	import PadModal from '$comp/padModal.svelte';
	import NewTagModal from '$comp/newTagModal.svelte';
	let { data } = $props();

	$slots = data.slots;
	$samples = data.samples;
	$tags = data.tags;
</script>

<LibraryModal />
<UploadModal />
<PadModal />
<NewTagModal />

<!-- <ChooseTheme /> -->
<div id="split" class="flex flex-col">
	<Launchpad />
	<Library samples={data.samples} />
</div>
