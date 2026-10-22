<script lang="ts">
	import { colors } from '#lib/colors.ts';
	import { colorModal, selectedColor } from '#stores/globals.ts';
	$selectedColor = colors.randomAvailable.code;
</script>

<button
	class="btn btn-circle"
	aria-label="Select Color"
	style="background-color: {$selectedColor ? colors.getHex($selectedColor) : ''};"
	onclick={() => $colorModal.showModal()}
></button>
