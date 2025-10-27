<script lang="ts">
	import Library from '$comp/library.svelte';
	import Launchpad from '$comp/launchpad.svelte';
	import UploadModal from '$comp/uploadModal.svelte';
	import PadModal from '$comp/padModal.svelte';
	import LibraryModal from '$comp/libraryModal.svelte';
	import { samples, slots } from '$stores/globals.js';
	import ChooseTheme from '$comp/chooseTheme.svelte';
	let { data } = $props();

	$slots = data.slots;
	$samples = data.samples;
</script>

<ChooseTheme />
<UploadModal />
<PadModal />
<LibraryModal />

<div id="split">
	<Launchpad />
	<Library samples={data.samples} />
</div>

<style>
	#split {
		display: grid;
		grid-template-rows: 1fr 1fr;
		width: 100%;
		height: 100%;
	}
</style>
