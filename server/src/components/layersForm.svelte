<script lang="ts">
	let { name = $bindable() }: { name: string } = $props();
</script>

<input type="text" class="input" bind:value={name} />
