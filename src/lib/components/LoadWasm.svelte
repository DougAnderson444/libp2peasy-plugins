<script>
	// a component to send data to a plugin
	import { createEventDispatcher } from 'svelte';
	export let pluginFile;

	let fileinput;

	const dispatch = createEventDispatcher();

	// this fires when todos change; let's emit an event to update any listeners consuming this component
	$: if (pluginFile) {
		dispatch('pluginFile', pluginFile);
		pluginFile = null; // reset loader state
		fileinput.value = null; // reset file input
	}

	const onFileSelected = (e) => {
		let plugin = e.target.files[0];
		let reader = new FileReader();

		reader.addEventListener('loadend', () => {
			// reader.result contains the contents of blob as a typed array
			pluginFile = reader.result;
		});

		// reader.readAsDataURL(plugin);
		reader.readAsArrayBuffer(plugin);
		// reader.readAsText(plugin);
	};
</script>

<input
	style="display:none"
	type="file"
	accept=".wasm, .wasm"
	on:change={(e) => onFileSelected(e)}
	bind:this={fileinput}
/>
<div
	class="flex justify-center cursor-pointer border border-green-400 rounded-md px-4 py-2 my-1"
	on:keypress={() => {
		fileinput.click();
	}}
	on:click={() => {
		fileinput.click();
	}}
>
	Load
</div>

<!-- Display bytes -->
{#if pluginFile}
	<div class="flex flex-col">
		<div class="flex-1 flex-row bg-green-50/10 p-2">File loaded</div>
		<div class="flex-1 flex-row">{@html pluginFile}</div>
	</div>
{/if}
