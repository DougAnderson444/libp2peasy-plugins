<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { peerIdFromString } from '@libp2p/peer-id';

	export let secret;
	export let plugin;

	const dispatch = createEventDispatcher();

	let data = '';
	let subscribeInput;
	let published = [];
	let subscribed = [];

	function handleSubscribe(e) {
		let peer_id = peerIdFromString(subscribeInput);
		console.log({ peer_id }, { bytes: peer_id.toBytes() });
		handleAction({ Subscribe: { peer_id_bytes: peer_id.toBytes() } });
	}

	// add topic to unsubscribe fn
	function handleUnsubscribe(input) {
		let peer_id = peerIdFromString(input);
		console.log({ peer_id }, { bytes: peer_id.toBytes() });
		handleAction({ Unsubscribe: { peer_id_bytes: peer_id.toBytes() } });
	}

	async function handleAction(payload) {
		console.log('handleAction sending', payload);
		const resp = await plugin.call('send', JSON.stringify(payload));
		let decoded = JSON.parse(new TextDecoder().decode(resp));
		console.log('handleAction', { decoded });
		if (decoded.Message)
			published = [...published, { topic: decoded.Message.topic, timestamp: Date.now() }];
		if (payload.Subscribe)
			subscribed = [...subscribed, { topic: subscribeInput, timestamp: Date.now() }];
	}
</script>

<div class="flex-1">
	<div class="flex-1 flex-row">IPNS</div>
	<div class="flex-1 flex-row">
		<div class="flex flex-row">
			<input
				class="flex-1 flex-row border border-gray-400 bg-neutral-700 rounded-md px-2 py-1 mx-2"
				type="text"
				bind:value={data}
			/>
			<button
				class="flex justify-center cursor-pointer border border-green-400 rounded-md px-4 py-2 my-1"
				on:click={(e) => handleAction({ Publish: { secret, data } })}>Publish</button
			>
		</div>
		<!-- List all the published in reverse chronological oder -->
		<div class="flex flex-col">
			{#if published.length > 0}
				<div class="flex-1 flex-row text-xl">Published</div>
			{:else}
				<div class="flex-1 flex-row">Nothing published yet</div>
			{/if}
			<!-- sort published array by timestamp field -->
			{#each published.sort((a, b) => a.timestamp < b.timestamp) as { timestamp, topic }, m}
				<div class="flex-1 flex-row">{new Date(timestamp).toLocaleTimeString('en-US')} {topic}</div>
			{/each}
		</div>
		<div class="flex flex-row">
			<input
				class="flex-1 flex-row border border-gray-400 bg-neutral-700 rounded-md px-2 py-1 mx-2"
				type="text"
				bind:value={subscribeInput}
			/>
			<button
				class="flex justify-center cursor-pointer border border-green-400 rounded-md px-4 py-2 my-1"
				on:click={handleSubscribe}>Subscribe</button
			>
		</div>
		<!-- List all the subscribed in reverse chronological oder -->
		<!-- with an unsubscribe button on the right -->
		<div class="flex flex-col">
			{#if subscribed.length > 0}
				<div class="flex-1 flex-row text-xl">Subscribed to:</div>
			{:else}
				<div class="flex-1 flex-row">Nothing subscribed yet</div>
			{/if}
			<!-- sort subscribed array by timestamp field -->
			{#each subscribed.sort((a, b) => a.timestamp < b.timestamp) as { timestamp, topic }, m}
				<div class="flex-1 flex-row">{new Date(timestamp).toLocaleTimeString('en-US')} {topic}</div>
				<button
					class="flex justify-center cursor-pointer border border-red-400 rounded-md px-4 py-2 my-1"
					on:click={(e) => handleUnsubscribe(topic)}>Unsubscribe</button
				>
			{/each}
		</div>
	</div>
</div>

<style>
	div {
		@apply m-1 p-1;
	}
</style>
