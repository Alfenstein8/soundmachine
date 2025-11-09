<script>
	import { layersModal, shownLayer } from '$stores/globals';
	import Layers from '@lucide/svelte/icons/layers';
	import LayersSelect from '$comp/layers/layersSelect.svelte';
</script>

<div class="mb-4 flex flex-wrap justify-center gap-1 align-middle">
	<button class="btn btn-ghost btn-circle" onclick={() => $layersModal.showModal()}>
		<Layers />
	</button>
	<LayersSelect bind:selected={$shownLayer} />
</div>
