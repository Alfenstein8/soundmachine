<script lang="ts">
	import { theme, themes } from '$stores/theme';
</script>

<select bind:value={$theme}>
	{#each themes as t (t)}
		<option value={t}>{t}</option>
	{/each}
</select>
