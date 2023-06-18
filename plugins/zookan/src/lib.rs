//! Use Delegated Anonymous Credentials to create a ZKP for a given statement.
//! use:
//! - Delanocreds crate
//! - json web proofs
//! - Issuer's website /.well-known/did
//!
//! ## API
//!
//! Take the user provided identifier (phone number, email, etc) as an attribute and
//! issue a Credential on it using Verification Key (Public Key).
//!
//! ## Issuing
//!
//! Send them the Credential on the channel that they provided the
//! identifier on (text them, email them, etc).
//!
//! ## Posting
//!
//! The user adds their public key(s) as attribute(s) and generates a proof.
//! Then they hash the identifier as the Record (DHT) or Topic (Pubsub) and the proof as the value.
//!
//! ## Search / Discovery
//!
//! Anyone searching for the identifier queries the identifier hash, and gets the proof.
//!
//! ## Verification / Selection
//!
//! Checks the proof against the Verification Key (Public Key) and decides whether they trust
//! the issuer or not, and whether to use the proven public key or not.
//!
//! ## Usage
//!
//! The proven public key can be an IPNS key or whatever, to get more data about the User.
//!
use delanocreds::keypair::{MaxCardinality, MaxEntries};

/// Create a Signer Keypair for the Root Issuer (Certificate Authority)
pub fn create_signer(max_card: u8, max_entries: u8) -> delanocreds::keypair::Signer {
    let issuer = delanocreds::keypair::Signer::new(
        MaxCardinality::from(max_card),
        MaxEntries::from(max_entries),
    );
    issuer
}

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
