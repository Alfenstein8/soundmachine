<script lang="ts">
	import { colorModal, selectedColor } from '$stores/globals';
</script>

<button
	class="btn btn-circle"
	aria-label="Select Color"
	style="{$selectedColor ? `background-color: ${$selectedColor[1]}` : ''};"
	onclick={() => $colorModal.showModal()}
></button>
