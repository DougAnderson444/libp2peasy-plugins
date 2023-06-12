use base64::{engine::general_purpose, Engine as _};
use extism_pdk::*;
use ipns_entry::entry::{ed25519, IpnsEntry, PeerId, PublicKey};
use ipns_entry::signer::{Keypair, Signed, Signer};
use ipns_entry::DataBuilder;
use ipns_plugin_interface::{GossipsubMessage, Message, SignPublish, SignableData};

const IPNS_PREFIX: &[u8] = b"/ipns/";

#[host_fn]
extern "ExtismHost" {
    fn publish_host(message: Json<Message>) -> Json<Message>;
}

// #[host_fn]
// extern "ExtismHost" {
//     fn on_message_host(message: Json<Message>) -> Json<Message>;
// }

// #[host_fn]
// extern "ExtismHost" {
//     fn subscribe_host(topic: Json<Message>) -> Json<Message>;
// }

// #[host_fn]
// extern "ExtismHost" {
//     fn unsubscribe_host(topic: Json<Message>) -> Json<Message>;
// }

// #[host_fn]
// extern "ExtismHost" {
//     fn signer(message: Json<Vec<u8>>) -> Json<Vec<u8>>;
// }

#[plugin_fn]
pub fn sign_and_publish(input: String) -> FnResult<Json<Message>> {
    // convert the Vec<u8> into a string
    // let data = std::str::from_utf8(input.as_slice())?;
    let SignPublish { secret, data } = serde_json::from_str(&input)?;

    // convert the secret from serde_json::Map<String, serde_json::Value> to Vec<u8>
    let secret = secret
        .into_iter()
        .map(|(_, v)| v.as_u64().unwrap() as u8)
        .collect::<Vec<u8>>();

    let (data, signables) = DataBuilder::new(data.as_str()).build();

    // make a keypair from the secret
    let keypair = Keypair::ed25519_from_bytes(secret)?;
    let signer = Signer::new(keypair);
    let signed = signer.sign(signables)?;
    let entry = IpnsEntry::new(data, signed);
    let routable_bytes = entry.to_bytes();
    let peer_id = PeerId::from_public_key(&signer.public());

    // PubSub Routing Record
    // Key format: /ipns/BINARY_ID
    // /ipns/ is the ASCII prefix (bytes in hex: 2f69706e732f)
    // BINARY_ID is the binary representation of IPNS Name.
    // IPNS Name is a Multihash of a serialized PublicKey.
    // String Representation of IPNS Name should be represented as a CIDv1 with libp2p-key multicodec (code 0x72), and encoded using case-insensitive Multibase such as Base36.
    // A good practice is to prefix IPNS Name with /ipns/ namespace, and refer to IPNS addresses as /ipns/{ipns-name}

    // concat IPNS_PREFIX string with peer_id string
    let topic = [IPNS_PREFIX.to_vec(), peer_id.to_bytes()].concat();

    // pubsub topics must be utf-8
    // use additional wrapping /record/base64url-unpadded(key)

    const RECORD_PREFIX: &str = "/record/";
    let encoded_key = general_purpose::URL_SAFE_NO_PAD.encode(topic);
    // concat prefix with encoded key
    let encoded_url = [RECORD_PREFIX, encoded_key.as_str()].concat();
    let msg = Message {
        topic: encoded_url,
        message: routable_bytes,
    };
    let output = unsafe { publish_host(Json(msg))? };

    Ok(output)
}
