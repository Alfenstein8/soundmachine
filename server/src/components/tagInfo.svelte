<script lang="ts">
	import ColorPicker from './colorPicker.svelte';

	let { tagName = $bindable() }: { tagName: string } = $props();
</script>

<!-- <input type="color" class="w-16 h-16 rounded-full border-none" bind:value={tagColor} /> -->
<ColorPicker />
<input type="text" class="textInput input" placeholder="Tag Name" bind:value={tagName} />
