<script>
	// a component to send data to a plugin
	import { createEventDispatcher } from 'svelte';
	export let pluginFile;

	const files = new Map();
	let fileinput;
	let name;

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

		files.set(reader, plugin);

		reader.addEventListener('loadend', (evt) => {
			console.log('reader.result', { reader }, { evt });
			// reader.result contains the contents of blob as a typed array
			pluginFile = { bytes: reader.result, name };
		});

		reader.addEventListener('load', (evt) => {
			const file = files.get(evt.target);
			console.log(`The contents of ${file.name}:`);
			name = file.name;
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
	Load *.wasm file
</div>

<!-- Display bytes -->
{#if pluginFile}
	<div class="flex flex-col">
		<div class="flex-1 flex-row bg-green-50/10 p-2">File loaded</div>
		<div class="flex-1 flex-row">{@html pluginFile}</div>
	</div>
{/if}
