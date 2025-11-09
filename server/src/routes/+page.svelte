<script lang="ts">
	import Library from '$comp/library/library.svelte';
	import Launchpad from '$comp/launchpad/launchpad.svelte';
	import { layers, samples, slots, tagAttachments, tags } from '$stores/globals.js';
	import LibraryModal from '$comp/library/libraryModal.svelte';
	import UploadModal from '$comp/uploadModal.svelte';
	import PadModal from '$comp/launchpad/padModal.svelte';
	import EditTagModal from '$comp/tags/editTagModal.svelte';
	import ColorModal from '$comp/colorModal.svelte';
	import { startPeriodicSync, stopPeriodicSync } from '$lib/client/sync.js';
	import { onMount } from 'svelte';
	import LayersModal from '$comp/layers/layersModal.svelte';
	let { data } = $props();

	$slots = data.slots;
	$samples = data.samples;
	$tags = data.tags;
	$tagAttachments = data.tagAttachments;
	$layers = data.layers;

	onMount(() => {
		startPeriodicSync();

		return () => {
			stopPeriodicSync();
		};
	});
</script>

<LibraryModal />
<UploadModal />
<PadModal />
<EditTagModal />
<ColorModal />
<LayersModal />

<!-- <ChooseTheme /> -->
<div id="split" class="mb-30 flex flex-col">
	<Launchpad />
	<Library />
</div>
