<script lang="ts">
	let { tagColor = $bindable(), tagName = $bindable() }: { tagColor: string; tagName: string } =
		$props();
</script>

<input type="color" class="h-16 w-16 rounded-full border-none" bind:value={tagColor} />
<input type="text" class="textInput input" placeholder="Tag Name" bind:value={tagName} />
