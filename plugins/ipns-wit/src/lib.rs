use anyhow::Result;
use base64::{engine::general_purpose, Engine as _};
use ipns_entry::entry::{IpnsEntry, PeerId};
use ipns_entry::signer::{Keypair, Signer};
use ipns_entry::DataBuilder;

wit_bindgen::generate!("ipns-pubsub" in "wit");

struct Exports;

impl IpnsPubsub for Exports {
    fn publish(
        cid: String,
        secret: Vec<u8>,
    ) -> Result<peerpiper::ipns_pubsub::types::Message, String> {
        let (data, signables) = DataBuilder::new(cid.as_str()).build();

        // make a keypair from the secret
        let keypair = match Keypair::ed25519_from_bytes(secret) {
            Ok(keypair) => keypair,
            Err(e) => return Err(format!("Secret Bytes DecodingError: {}", e)),
        };
        let signer = Signer::new(keypair);
        let signed = match signer.sign(signables) {
            Ok(signed) => signed,
            Err(e) => return Err(format!("SigningError: {}", e)),
        };
        let entry = IpnsEntry::new(data, signed);
        let routable_bytes = entry.to_bytes();
        let peer_id = PeerId::from_public_key(&signer.public());

        let msg = peerpiper::ipns_pubsub::types::Message {
            topic: peer_id_to_record_key(&peer_id.to_bytes()),
            record: routable_bytes,
        };

        peerpiper::ipns_pubsub::imports::publish(&msg);
        Ok(msg)
    }

    fn subscribe(msg: String) {
        let new_msg = format!("Guest Subscribing to {} ", msg);
        peerpiper::ipns_pubsub::imports::prnt(&new_msg);
        peerpiper::ipns_pubsub::imports::subscribe(&msg);
    }

    fn unsubscribe(msg: String) {
        let new_msg = format!("Guest UN-Subscribing to {} ", msg);
        peerpiper::ipns_pubsub::imports::prnt(&new_msg);
        peerpiper::ipns_pubsub::imports::unsubscribe(&msg);
    }
}

/// A helper function that converts a peer id to a record key.
pub fn peer_id_to_record_key(peer_id_bytes: &[u8]) -> String {
    // PubSub Routing Record
    // Key format: /ipns/BINARY_ID
    // /ipns/ is the ASCII prefix (bytes in hex: 2f69706e732f)
    // BINARY_ID is the binary representation of IPNS Name.
    // IPNS Name is a Multihash of a serialized PublicKey.
    // String Representation of IPNS Name should be represented as a CIDv1 with libp2p-key multicodec (code 0x72), and encoded using case-insensitive Multibase such as Base36.
    // A good practice is to prefix IPNS Name with /ipns/ namespace, and refer to IPNS addresses as /ipns/{ipns-name}

    // concat IPNS_PREFIX string with peer_id string

    // pubsub topics must be utf-8
    // use additional wrapping /record/base64url-unpadded(key)

    [
        "/record/",
        general_purpose::URL_SAFE_NO_PAD
            .encode([b"/ipns/", peer_id_bytes].concat())
            .as_str(),
    ]
    .concat()
}

export_ipns_pubsub!(Exports);

// #[derive(Debug)]
// enum ErrorString {
//     DecodingError(libp2p_identity::error::DecodingError),
//     SigningError(ipns_entry::signer::SigningError),
// }

// impl std::fmt::Display for ErrorString {
//     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
//         match self {
//             ErrorString::DecodingError(e) => write!(f, "Secret Bytes DecodingError: {}", e),
//             ErrorString::SigningError(e) => write!(f, "SigningError: {}", e),
//         }
//     }
// }
