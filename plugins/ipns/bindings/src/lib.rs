use base64::{engine::general_purpose, Engine as _};
use extism_pdk::*;
use ipns_entry::entry::{IpnsEntry, PeerId};
use ipns_entry::signer::{Keypair, Signer};
use ipns_entry::DataBuilder;
use ipns_plugin_interface::{Message, SignPublish};
use serde::{Deserialize, Serialize};

const IPNS_PREFIX: &[u8] = b"/ipns/";

#[host_fn]
extern "ExtismHost" {
    fn publish_host(message: Json<Message>) -> Json<Message>;
}

#[host_fn]
extern "ExtismHost" {
    fn subscribe_host(topic: Json<String>) -> Json<String>;
}

#[host_fn]
extern "ExtismHost" {
    fn unsubscribe_host(topic: Json<String>) -> Json<String>;
}

#[derive(Debug, Deserialize)]
enum Action {
    Publish(SignPublish),
    Subscribe {
        peer_id_bytes: json::Map<String, json::Value>,
    },
    Unsubscribe {
        peer_id_bytes: json::Map<String, json::Value>,
    },
}

#[derive(Debug, Serialize, Deserialize)]
pub enum Response {
    Message(Message),
    Bool(bool),
}

#[plugin_fn]
pub fn send(input: String) -> FnResult<Json<Response>> {
    let sent: Action = json::from_str(&input)?;

    match sent {
        Action::Publish(secret_and_data) => sign_and_publish(secret_and_data),
        Action::Subscribe { peer_id_bytes } => subscribe(peer_id_bytes),
        Action::Unsubscribe { peer_id_bytes } => unsubscribe(peer_id_bytes),
    }
}

pub fn subscribe(peer_id_bytes: json::Map<String, json::Value>) -> FnResult<Json<Response>> {
    let peer_id_bytes = peer_id_bytes
        .into_iter()
        .map(|(_, v)| v.as_u64().unwrap() as u8)
        .collect::<Vec<u8>>();

    let key = peer_id_to_record_key(&peer_id_bytes);
    let _output = unsafe { subscribe_host(Json(key))? };

    Ok(Json(Response::Bool(true)))
}

pub fn unsubscribe(peer_id_bytes: json::Map<String, json::Value>) -> FnResult<Json<Response>> {
    let peer_id_bytes = peer_id_bytes
        .into_iter()
        .map(|(_, v)| v.as_u64().unwrap() as u8)
        .collect::<Vec<u8>>();

    let key = peer_id_to_record_key(&peer_id_bytes);
    let _output = unsafe { unsubscribe_host(Json(key))? };

    Ok(Json(Response::Bool(true)))
}

pub fn sign_and_publish(input: SignPublish) -> FnResult<Json<Response>> {
    // convert the Vec<u8> into a string
    // let data = std::str::from_utf8(input.as_slice())?;
    let SignPublish { secret, data } = input;

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

    let msg = Message {
        topic: peer_id_to_record_key(&peer_id.to_bytes()),
        message: routable_bytes,
    };
    let _output = unsafe { publish_host(Json(msg.clone()))? };

    Ok(Json(Response::Message(msg)))
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
            .encode([IPNS_PREFIX, peer_id_bytes].concat())
            .as_str(),
    ]
    .concat()
}
