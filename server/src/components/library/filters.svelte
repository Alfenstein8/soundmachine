<script lang="ts">
	import Heart from '@lucide/svelte/icons/heart';
	import Eye from '@lucide/svelte/icons/eye';
	import EyeClosed from '@lucide/svelte/icons/eye-closed';
	let {
		showUsed = $bindable(true),
		showNonFavorite = $bindable(true),
		onchange = () => {}
	}: { showUsed: boolean; showNonFavorite: boolean; onchange: () => void } = $props();
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

<label class="swap">
	<input type="checkbox" bind:checked={showNonFavorite} {onchange} />
	<div class="swap-on">
		<Heart />
	</div>
	<div class="swap-off">
		<Heart fill="var(--color-secondary)" color="var(--color-secondary)" />
	</div>
</label>
