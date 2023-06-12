<script>
	import { onMount } from 'svelte';
	import Plugin from '$lib/components/Plugin.svelte';
	import Send from '$lib/components/Send.svelte';
	import Received from '$lib/components/Received.svelte';
	import LoadWasm from '$lib/components/LoadWasm.svelte';
	import { register } from '$lib/pluginRunner/index.js';
	import { publishMessage, startLibp2p, connectToMultiaddr } from '$lib/p2p/libp2p';
	import { generateKeyPairFromSeed, generateKeyPair, sign } from '@stablelib/ed25519';
	import { stringify } from 'postcss';

	let loadPlugin,
		handleSend = null;
	let response = '';
	let keyPair;
	onMount(async () => {
		const libp2p = await startLibp2p();

		// @ts-ignore
		window.libp2p = libp2p;

		// myPeerId = libp2p.peerId.toString();

		// libp2p.addEventListener('peer:connect', peerConnected);
		// @ts-ignore
		// libp2p.pubsub.addEventListener('message', handleMessage);

		// Signing keypair
		keyPair = generateKeyPair();
		function signer(message) {
			let signed = sign(keyPair.secretKey, message);
			console.log({ signed });
			return signed;
		}

		loadPlugin = async (e) => {
			let data = new Uint8Array(e.detail); // e.detail; //
			// remove "data:application/wasm;base64," from beginning of string
			// data = data.substring(29);
			console.log({ data });

			const manifest = {
				wasm: [{ data }]
			};
			const functions = {
				publish_host: function (/** @type {number} */ index) {
					console.log('publishing ' + this.allocator.getString(index));
					console.log('parsed ' + JSON.parse(this.allocator.getString(index)));
					return index;
				}
				// subscribe_host: function (/** @type {number} */ index) {
				// 	console.log('subscribing ' + this.allocator.getString(index));
				// 	return index;
				// },
				// unsubscribe_host: function (/** @type {number} */ index) {
				// 	console.log('unsubscribing ' + this.allocator.getString(index));
				// 	return index;
				// },
				// on_message_host: function (/** @type {number} */ index) {
				// 	console.log('on_message ' + this.allocator.getString(index));
				// 	return index;
				// },
				// signer: function (/** @type {number} */ index) {
				// 	let s = new Uint8Array(Array.from(JSON.parse(this.allocator.getString(index))));
				// 	console.log('signing ', { s });
				// 	// parse array string into an acual uint8array
				// 	return signer(s);
				// }
			};
			/**
			 * @type {Map<string, string>}
			 */
			const config = new Map([['secret_key', keyPair.secret]]);
			let registered = await register({ manifest, functions, config });
			console.log({ registered });
			plugins = [...plugins, registered];
		};

		handleSend = async (e, plugin) => {
			let input = JSON.stringify({
				// take the first 32 bytes
				secret: keyPair.secretKey.slice(0, 32),
				data: e.detail
			});
			console.log('sending for', { input }, { sk: keyPair.secretKey });
			// encode Stirng as utf8
			let messageData = await plugin.sign_and_publish(input);
			console.log('sign_and_publish for', { messageData });
			response = JSON.parse(new TextDecoder().decode(messageData));
		};
	});

	let plugins = [];
</script>

<main class="flex flex-col h-screen p-2 bg-neutral-800 text-[#41FF00] font-mono">
	<div class="flex-1">
		<h1 class="text-4xl font-semibold">Libp2peasy 🍋✊ Plugins Demo</h1>
	</div>
	{#each plugins as plugin, p}
		<div class="flex flex-row h-full border-dashed border-current border">
			<Plugin>
				<div slot="meta" class="flex-1 flex-row bg-green-50/10">{plugins[p].name}</div>
				<div slot="activity" class="flex-1 flex-row bg-green-50/10">
					<Send on:send={(e) => handleSend(e, plugin)}>
						<!-- iterate through all keys in plugin -->
						{#each Object.keys(plugin) as key, k}
							<!-- if key is a function, display it -->
							{k}.Key {key}
							{#if typeof plugin[key] === 'function'}
								<div class="flex flex-row">
									<div class="flex-1 flex-row">{key}</div>
									<div class="flex-1 flex-row">
										<button
											class="border border-gray-400 rounded-md px-2 py-1 my-1"
											on:click={async () => {
												let result = await plugin[key]('hello');
												response = JSON.parse(new TextDecoder().decode(result));
												console.log('result for', key, response);
											}}
										>
											{key}
										</button>
									</div>
								</div>
							{/if}
						{/each}
					</Send>
					<Received>
						<pre>{JSON.stringify(response, null, 2)}</pre>
					</Received>
				</div>
			</Plugin>
		</div>
	{/each}
	{#if loadPlugin}
		<div class="flex flex-row border-dashed border-current border">
			<div class="flex-1 flex-row">Load Plugin</div>
			<LoadWasm on:pluginFile={loadPlugin} />
		</div>
	{/if}
</main>

<style>
	div {
		@apply m-1 p-2;
	}
</style>
