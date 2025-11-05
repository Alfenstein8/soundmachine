<script lang="ts">
	import { availableColorCodes, colors } from '$lib/colors';
	import { pickRandom } from '$lib/utils';
	import { colorModal, selectedColor } from '$stores/globals';
	$selectedColor = pickRandom(availableColorCodes);
	$inspect($selectedColor);
</script>

<button
	class="btn btn-circle"
	aria-label="Select Color"
	style="background-color: {$selectedColor ? colors.getValue($selectedColor) : ""};"
	onclick={() => $colorModal.showModal()}
></button>
