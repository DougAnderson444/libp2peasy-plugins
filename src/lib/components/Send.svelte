<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	/**
	 * @type {string}
	 */
	export let value;
</script>

<!-- tailwindcss form -->
<div class="">Send data to plugin</div>
<!-- <input
	type="text"
	bind:value
	class="border border-gray-400 rounded-md px-2 py-1 w-full my-2 bg-neutral-700"
	placeholder="Enter data to send"
/>
<button class="border border-gray-400 rounded-md px-2 py-1 my-1" on:click={dispatch('send', value)}
	>Publish Pubsub</button
> -->
<slot />
