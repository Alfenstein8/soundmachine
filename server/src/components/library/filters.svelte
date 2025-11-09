<script lang="ts">
	import Eye from '@lucide/svelte/icons/eye';
	import EyeClosed from '@lucide/svelte/icons/eye-closed';
	let {
		showUsed = $bindable(true),
		onchange = () => {}
	}: { showUsed: boolean; onchange: () => void } = $props();
</script>

<label class="swap">
	<input type="checkbox" bind:checked={showUsed} {onchange} />
	<div class="swap-on">
		<Eye />
	</div>
	<div class="swap-off">
		<EyeClosed />
	</div>
</label>
