<script>
	import { onMount } from 'svelte';
	import { assets, base } from '$app/paths';

	import Plugin from '$lib/components/Plugin.svelte';
	import Send from '$lib/components/Send.svelte';
	import Received from '$lib/components/Received.svelte';
	import LoadWasm from '$lib/components/LoadWasm.svelte';
	import { register } from '$lib/pluginRunner/index.js';
	import { publishMessage, startLibp2p, connectToMultiaddr } from '$lib/p2p/libp2p';
	import { generateKeyPair, supportedKeys } from '@libp2p/crypto/keys';

	import IPNS from '$lib/components/IPNS.svelte';
	import { ExtismContext } from '@extism/runtime-browser';
	import { peerIdFromString } from '@libp2p/peer-id';
	import { createEd25519PeerId, createFromPubKey } from '@libp2p/peer-id-factory';

	let loadPlugin,
		handleSend = null;
	let response = '';
	let keyPair;
	let published = [];
	let subscribed = [];
	let myPeerId;

	let sending = {};
	onMount(async () => {
		const libp2p = await startLibp2p();

		// @ts-ignore
		window.libp2p = libp2p;

		// myPeerId = libp2p.peerId.toString();

		// libp2p.addEventListener('peer:connect', peerConnected);
		// @ts-ignore
		// libp2p.pubsub.addEventListener('message', handleMessage);

		// Signing keypair
		keyPair = await generateKeyPair('Ed25519');
		myPeerId = await createFromPubKey(keyPair.public);

		loadPlugin = async (e) => {
			let data = new Uint8Array(e.detail.bytes); // e.detail; //
			// remove "data:application/wasm;base64," from beginning of string
			// data = data.substring(29);
			console.log({ data });

			const manifest = {
				wasm: [{ data }]
			};
			const functions = {
				publish_host: function (/** @type {number} */ index) {
					let to_publish = JSON.parse(this.allocator.getString(index));
					let data = new Uint8Array(to_publish.message);
					console.log('parsed ', { to_publish }, { data });

					libp2p.services.pubsub.publish(to_publish.topic, data).then(() => {
						console.log('published', { published });
					});

					return index;
				},
				subscribe_host: function (/** @type {number} */ index) {
					let recordKey = JSON.parse(this.allocator.getString(index));
					console.log('subscribing ', recordKey);
					libp2p.services.pubsub.subscribe(recordKey);
					return index;
				},
				unsubscribe_host: function (/** @type {number} */ index) {
					let recordKey = JSON.parse(this.allocator.getString(index));
					console.log('unsubscribing ', recordKey);

					libp2p.services.pubsub.unsubscribe(recordKey);
					return index;
				}
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

			const config = new Map([['a', 'b']]);
			const ctx = new ExtismContext();
			const plugin = await ctx.newPlugin(manifest, functions, config);

			let funcs = Object.keys(await plugin.getExports());
			console.log('funcs', funcs);

			plugins = [...plugins, { name: e.detail.name, plugin }];

			sending = { ...sending, [e.detail.name]: 'Enter' };
		};

		handleSend = async (e, plugin) => {
			let input = JSON.stringify({
				// take the first 32 bytes
				secret: keyPair.secretKey.slice(0, 32),
				data: e.detail
			});
			console.log('handleSend', { e: e.detail });
			published = [...published, { message: e.detail, published: false }];

			// encode Stirng as utf8
			let messageData = await plugin.sign_and_publish(input);
			// console.log('sign_and_publish for', { messageData });
			response = JSON.parse(new TextDecoder().decode(messageData));
		};
	});

	let plugins = [];
</script>

<main class="flex flex-col h-screen p-2 bg-neutral-800 text-[#41FF00] font-mono">
	<div class="flex-1">
		<h1 class="text-4xl font-semibold">Libp2peasy 🍋✊ Plugins Demo</h1>
	</div>
	{#if myPeerId}
		<div class="flex-1 flex-row">
			<div class="flex-1 flex-row">Peer ID</div>
			<div class="flex-1 flex-row">{myPeerId}</div>
		</div>
	{/if}
	{#if plugins.length == 0}
		<div class="flex-1 flex-row text-xl">
			Downloadload <a
				href="{base}/ipns_plugin_bindings.wasm"
				class="underline border rounded border-green-400 p-4">example plugin from here</a
			>
		</div>
	{/if}
	{#each plugins as { plugin }, p}
		<div class="flex flex-row h-full border-dashed border-current border">
			<IPNS secret={keyPair.bytes.slice(0, 32)} {plugin} />
			<!--
			<Plugin>
				<div
					slot="meta"
					class="flex-1 flex-row bg-green-50/10"
					contenteditable="true"
					bind:innerHTML={plugins[p].name}
				>
					{plugins[p].name}
				</div>
				<div slot="activity" class="flex-1 flex-row bg-green-50/10">
					<Send>
						{#each Object.keys(registered) as key, k}
							{#if typeof registered[key] === 'function'}
								<div class="flex flex-row">
									<div class="flex-1 flex-row">
										<input
											type="text"
											class="border border-gray-400 rounded-md px-2 py-1 w-full my-2 bg-neutral-700"
											placeholder="Enter data to send"
											bind:value={sending[key]}
										/>
									</div>
									<div class="flex-1 flex-row">
										<button
											class="border border-gray-400 rounded-md px-2 py-1 my-2"
											on:click={async (e) => {
												published = [...published, { message: sending[key], published: false }];

												let input = JSON.stringify({
													secret: keyPair.secretKey.slice(0, 32),
													data: sending[key]
												});

												let result = await registered[key](input);
												response = JSON.parse(new TextDecoder().decode(result));
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
						{#if published.length > 0}
							<div class="flex-1 flex-row text-xl">Published</div>

							<div class="flex flex-col">
								{#each published as entry, m}
									{#if entry.published}
										<div class="flex-1 flex-row">{m} {entry.message}</div>
									{/if}
								{/each}
							</div>
						{:else}
							<div class="flex-1 flex-row">Nothing published yet</div>
						{/if}

						{#if subscribed.length > 0}
							<div class="flex-1 flex-row text-xl">Subscribed</div>

							<div class="flex flex-col">
								{#each subscribed as entry, m}
									{#if entry.published}
										<div class="flex-1 flex-row">{m} {entry.message}</div>
									{/if}
								{/each}
							</div>
						{:else}
							<div class="flex-1 flex-row">Nothing subscribed yet</div>
						{/if}
					</Received>
				</div>
			</Plugin>
		 -->
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
		@apply m-1 p-1;
	}
</style>
