<script>
	import { onMount } from 'svelte';
	import { assets, base } from '$app/paths';
	import LoadWasm from '$lib/components/LoadWasm.svelte';
	import { generate } from '$lib';

	let loadPlugin;
	let plugingScript;
	let pub;

	$: if (window && window.test) {
		console.log('publish', window.test);
		pub = window.test;
	}

	onMount(async () => {
		loadPlugin = async (e) => {
			let { name, bytes: component } = e.detail;

			// make some generate options:
			// record generate-options {
			//     /// Name to use for the generated component
			//     name: string,

			//     /// Disables generation of `*.d.ts` files and instead only generates `*.js`
			//     /// source files.
			//     no-typescript: option<bool>,

			//     /// Provide a custom JS instantiation API for the component instead
			//     /// of the direct importable native ESM output.
			//     instantiation: option<bool>,

			//     /// Mappings of component import specifiers to JS import specifiers.
			//     map: option<maps>,

			//     /// Enables all compat flags: --tla-compat.
			//     compat: option<bool>,

			//     /// Disables compatibility in Node.js without a fetch global.
			//     no-nodejs-compat: option<bool>,

			//     /// Set the cutoff byte size for base64 inlining core Wasm in instantiation mode
			//     /// (set to 0 to disable all base64 inlining)
			//     base64-cutoff: option<u32>,

			//     /// Enables compatibility for JS environments without top-level await support
			//     /// via an async $init promise export to wait for instead.
			//     tla-compat: option<bool>,

			//     /// Disable verification of component Wasm data structures when
			//     /// lifting as a production optimization
			//     valid-lifting-optimization: option<bool>,
			// }

			// remove the trailing `.wasm` from the name
			name = name.substring(0, name.length - 5);
			let map = Object.assign(
				{},
				{
					'wasi:*': 'https://unpkg.com/@bytecodealliance/preview2-shim@0.0.9/lib/browser/*'
				},
				{
					'peerpiper:ipns-pubsub': `http://localhost:5173/ipns-pubsub.js`
					// './ipns_pubsub*': '../ipns-pubsub',
					// './IpnsPubsub*': '../ipns-pubsub'
				}
			);

			console.log({ map });

			// see jco/cmd/transpile.js
			let opts = {
				name,
				map: Object.entries(map ?? {}),
				instantiation: false,
				validLiftingOptimization: false,
				noNodejsCompat: true,
				tlaCompat: false,
				base64Cutoff: 999999
			};
			// pass into generate along with bytes
			let { files, imports, exports } = generate(component, opts);

			console.log({ files, imports, exports });

			// TODO: Bundle with Rollup and import the single file
			// TODO: How does rollup handle the wasm? Base64?

			// take `name`.js and import it as a js url blob to module
			// when element 0 in array is `name`.js
			let match = files.find((element) => element[0] === `${name}.js`);

			console.log('match', { match });

			plugingScript = `<script type="module">

${new TextDecoder('utf-8').decode(match[1])}
window.test = "it works";
window.publish = publish;

<\/script>
            `;

			// now how do I call publish? It's defined in the <script> tag of the <head>
			// of the page. I need to get a reference to that script tag and call publish
			// on it. I can't just call publish here because it's not defined yet.

			// How do I get a reference to an export function defined in the <head> of the page?

			// console.log({ plugingScript });

			// const blob = new Blob([match[1]], { type: 'text/javascript' });
			// const url = URL.createObjectURL(blob);
			// console.log({ url });
			// const mod = await import(/* @vite-ignore */ url);
		};
	});
</script>

<svelte:head>
	{#if plugingScript}
		<!-- add title  -->
		<title>WIT Model</title>
		{@html plugingScript}
	{/if}
</svelte:head>
<div class="container">
	<div class="row">
		<div class="col-12">
			<div class="text-xl">Plugins from WIT Model</div>
		</div>
	</div>
	{#if loadPlugin}
		<div class="flex flex-row border-dashed border-current border">
			<div class="flex-1 flex-row">Load Plugin</div>
			<LoadWasm on:pluginFile={loadPlugin} />
		</div>
	{/if}

	{#if pub}
		<div class="flex flex-row border-dashed border-current border">
			<div class="flex-1 flex-row">Publish</div>
			<button on:click={pub}>Publish</button>
		</div>
	{/if}
</div>

<style>
	div {
		@apply m-1 p-1;
	}
</style>
