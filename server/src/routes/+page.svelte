<script lang="ts">
	import Library from '$comp/library/library.svelte';
	import Launchpad from '$comp/launchpad/launchpad.svelte';
	import { layers, samples, slots, tagAttachments, tags } from '$stores/globals.js';
	import LibraryModal from '$comp/library/libraryModal.svelte';
	import UploadModal from '$comp/uploadModal.svelte';
	import PadModal from '$comp/launchpad/padModal.svelte';
	import EditTagModal from '$comp/tags/editTagModal.svelte';
	import ColorModal from '$comp/colorModal.svelte';
	import { syncClient } from '$lib/client/sync.js';
	import { onMount } from 'svelte';
	import LayersModal from '$comp/layers/layersModal.svelte';
	let { data } = $props();

	$slots = data.slots;
	$samples = data.samples;
	$tags = data.tags;
	$tagAttachments = data.tagAttachments;
	$layers = data.layers;

	onMount(() => {
		setInterval(() => {
			syncClient();
		}, 10000);
	});
</script>

<LibraryModal />
<UploadModal />
<PadModal />
<EditTagModal />
<ColorModal />
<LayersModal />

<!-- <ChooseTheme /> -->
<div id="split" class="flex flex-col mb-30">
	<Launchpad />
	<Library />
</div>
