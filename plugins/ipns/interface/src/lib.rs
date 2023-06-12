use ipns_entry::cbor;
use ipns_entry::signer;
use serde::{Deserialize, Serialize};

pub use libp2p_gossipsub::Message as GossipsubMessage;

#[derive(Serialize, Deserialize, PartialEq, Debug, Clone, Hash)]
pub struct Message {
    pub topic: String,
    pub message: Vec<u8>,
}

#[derive(Serialize, Deserialize, PartialEq, Debug, Hash)]
pub struct SignableData {
    pub data: cbor::Data,
    pub signables: signer::Signables,
}

/// SignPublish is the input to the sign_and_publish function
/// - `secret` is the secret key
/// - `data` is the data to sign and publish
#[derive(Serialize, Deserialize, PartialEq, Debug)]
pub struct SignPublish {
    pub secret: serde_json::Map<String, serde_json::Value>,
    pub data: String,
}
