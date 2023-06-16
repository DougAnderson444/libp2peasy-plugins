export const CHAT_TOPIC = 'universal-connectivity';

export const CIRCUIT_RELAY_CODE = 290;

export const WEBRTC_BOOTSTRAP_NODE =
	'/ip6/2607:fea8:fec0:7337:c801:d716:2390:f790/udp/9090/webrtc-direct/certhash/uEiCGy2PnRK-KmkckQRvSlyoZtptV3jF2tMOCX2NhXsfTig/p2p/12D3KooWQDZeK4DUxiksnvvDuhSx6csd7XzVT1GGWw7fPKyp9nBJ';
export const WEBTRANSPORT_BOOTSTRAP_NODE =
	'/ip4/3.125.128.80/udp/9095/quic-v1/webtransport/certhash/uEiAGIlVdiajNz0k1RHjrxlNXN5bb7W4dLPvMJYUrGJ9ZUQ/certhash/uEiDYZsZoO8vuTKlPhxvVR5SFwOkbXfjlsmTLUHNlnG24bg/p2p/12D3KooWEymoJRHaxizLrrKgJ9MhEYpG85fQ7HReRMJuEMLqmNMg';

export const IPFS_BOOTNODES = [
	'QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
	'QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
	'QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
	'QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt'
];

export const IPFS_BOOT_ADDR = '/dnsaddr/bootstrap.libp2p.io';

// combine IPFS_BOOTNODES and IPFS_BOOT_ADDR to make a list of '/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN';
export const IPFS_BOOTNODES_ADDR = IPFS_BOOTNODES.map((node) => `/ipfs/${node}`);
