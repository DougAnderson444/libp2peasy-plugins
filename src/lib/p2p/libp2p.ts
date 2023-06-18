import { createLibp2p } from 'libp2p';
import { webRTC, webRTCDirect } from '@libp2p/webrtc';
import { webTransport } from '@libp2p/webtransport';
import { gossipsub } from '@chainsafe/libp2p-gossipsub';
import { sha256 } from 'multiformats/hashes/sha2';
import { CHAT_TOPIC, WEBRTC_BOOTSTRAP_NODE, CIRCUIT_RELAY_CODE } from './constants';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { kadDHT } from '@libp2p/kad-dht';
import { bootstrap } from '@libp2p/bootstrap';
import { multiaddr } from '@multiformats/multiaddr';
import { identifyService } from 'libp2p/identify';
import { webSockets } from '@libp2p/websockets';
import * as filters from '@libp2p/websockets/filters';

// @ts-ignore
import { circuitRelayTransport } from 'libp2p/circuit-relay';

import type { Message, SignedMessage } from '@libp2p/interface-pubsub';
import type { Multiaddr } from '@multiformats/multiaddr';
import type { Libp2p } from 'libp2p';

export async function startLibp2p(bootstrapNodes: string[] = [WEBRTC_BOOTSTRAP_NODE]) {
	// localStorage.debug = 'libp2p*,-*:trace'; // if you wanted to exclude aything containing "gossipsub", you would add -gossipsub
	// localStorage.debug = "libp2p:connection-manager:dial-queue"

	let peerDiscovery =
		bootstrapNodes.length > 0
			? [
					bootstrap({
						list: bootstrapNodes,
						tagTTL: 31536000000 // 100 years in ms 100 * 60 * 60 * 24 * 365 * 1000 = 31536000000
					})
			  ]
			: [];

	const libp2p = await createLibp2p({
		addresses: {
			listen: ['/webrtc']
		},
		transports: [
			webTransport(),
			webSockets({
				filter: filters.all
			}),
			webRTC({
				rtcConfiguration: {
					iceServers: [
						{
							urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478']
						}
					]
				}
			}),
			webRTCDirect(),
			circuitRelayTransport({
				discoverRelays: 1
			})
		],
		connectionManager: {
			maxConnections: 10,
			minConnections: 5
		},
		connectionEncryption: [noise()],
		streamMuxers: [yamux()],
		connectionGater: {
			denyDialMultiaddr: async () => false
		},
		peerDiscovery: [
			bootstrap({
				list: bootstrapNodes,
				timeout: 1000, // in ms,
				tagName: 'bootstrap',
				tagValue: 50,
				tagTTL: 120000 // in ms
			})
		],
		services: {
			pubsub: gossipsub({
				allowPublishToZeroPeers: true,
				msgIdFn: msgIdFnStrictNoSign,
				ignoreDuplicatePublishError: true,
				emitSelf: true
			}),
			dht: kadDHT({
				protocolPrefix: '/universal-connectivity',
				maxInboundStreams: 5000,
				maxOutboundStreams: 5000,
				clientMode: true
			}),
			identify: identifyService()
		}
	});

	libp2p.services.pubsub.subscribe(CHAT_TOPIC);

	libp2p.addEventListener('self:peer:update', ({ detail: { peer } }) => {
		const multiaddrs = peer.addresses.map(({ multiaddr }) => multiaddr);

		console.log(`changed multiaddrs: peer ${peer.id.toString()} multiaddrs: ${multiaddrs}`);
		setWebRTCRelayAddress(multiaddrs, libp2p.peerId.toString());

		const connListEls = libp2p.getConnections().map((connection) => {
			return connection.remoteAddr.toString();
		});

		console.log('connections: ', connListEls);

		// findPeer
	});

	return libp2p;
}

export const setWebRTCRelayAddress = (maddrs: Multiaddr[], peerId: string) => {
	maddrs.forEach((maddr) => {
		if (maddr.protoCodes().includes(CIRCUIT_RELAY_CODE)) {
			const webRTCrelayAddress = multiaddr(maddr.toString() + '/webrtc/p2p/' + peerId);

			console.log(`Listening on '${webRTCrelayAddress.toString()}'`);

			setCircuit(webRTCrelayAddress.toString());
			copyToClipboard(document.querySelector<HTMLButtonElement>('#copy')!);
		}
	});
};
export function setCircuit(value: string) {
	document.querySelector<HTMLInputElement>('#circuit')!.value = value;
}
export function copyToClipboard(element: HTMLButtonElement) {
	element.addEventListener('click', async () => {
		const circuit = document.querySelector<HTMLInputElement>('#circuit')!;
		circuit.select();
		circuit.setSelectionRange(0, 99999);
		// without using         document.execCommand("copy"), use alternate method
		// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
		await navigator.clipboard.writeText(circuit.value);
	});
}

// message IDs are used to dedup inbound messages
// every agent in network should use the same message id function
// messages could be perceived as duplicate if this isnt added (as opposed to rust peer which has unique message ids)
export async function msgIdFnStrictNoSign(msg: Message): Promise<Uint8Array> {
	var enc = new TextEncoder();

	const signedMessage = msg as SignedMessage;
	const encodedSeqNum = enc.encode(signedMessage.sequenceNumber.toString());
	return await sha256.encode(encodedSeqNum);
}

export const connectToMultiaddr = (libp2p: Libp2p) => async (multiaddr: Multiaddr) => {
	console.log(`dialing: ${multiaddr.toString()}`);
	try {
		const conn = await libp2p.dial(multiaddr);
		// or dialProtocol
		// const conn = await libp2p.dialProtocol(multiaddr, [
		//     "/floodsub/1.0.0",
		//     "/ipfs/id/1.0.0",
		//     "/ipfs/id/push/1.0.0",
		//     "/ipfs/ping/1.0.0",
		//     "/libp2p/autonat/1.0.0",
		//     "/libp2p/fetch/0.0.1",
		//     "/meshsub/1.1.0",
		//     "/universal-connectivity/lan/kad/1.0.0",
		//     "/universal-connectivity/1.0.0",
		// ])
		return conn;
	} catch (e) {
		console.error(e);
		throw e;
	}
};

export const publishMessage = (libp2p: Libp2p) => async (message: string) => {
	try {
		const res = await libp2p.services.pubsub.publish(CHAT_TOPIC, new TextEncoder().encode(message));

		console.log(
			'sent message to: ',
			res.recipients.map((peerId) => peerId.toString())
		);
	} catch (e) {
		console.error(e);
		throw e;
	}
};
