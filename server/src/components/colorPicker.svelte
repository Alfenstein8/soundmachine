<script lang="ts">
	import { colors } from '$lib/colors';
	import { colorModal, selectedColor } from '$stores/globals';
	$selectedColor = colors.randomAvailable.code;
</script>

<button
	class="btn btn-circle"
	aria-label="Select Color"
	style="background-color: {$selectedColor ? colors.getHex($selectedColor) : ""};"
	onclick={() => $colorModal.showModal()}
></button>
