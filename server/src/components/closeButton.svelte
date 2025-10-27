<script lang="ts">
	import { X } from '@lucide/svelte';

	let { onClick }: { onClick: () => void } = $props();
</script>

<button onclick={onClick}>
	<X />
</button>

<style>
  button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
  }
  button:hover {
    background-color: #f0f0f0;
    border-radius: 50%;
  }

</style>
