use anyhow::{Error, Result};
use extism::Function;
use extism::ValType;
use extism::{CurrentPlugin, UserData, Val};
use extism::{Plugin, PluginBuilder};
use ipns_plugin_interface::SignableData;
use libp2p_identity::ed25519::SecretKey;

pub struct IPNSPlugin<'a> {
    plugin: Plugin<'a>,
}

impl IPNSPlugin<'_> {
    pub fn new(wasm: &[u8]) -> Result<IPNSPlugin> {
        /// Host function that is called by the plugin
        // https://github.com/extism/rust-pdk/blob/main/examples/host_function.rs
        pub fn publish_host(
            _plugin: &mut CurrentPlugin,
            inputs: &[Val],
            outputs: &mut [Val],
            _user_data: UserData,
        ) -> Result<(), Error> {
            eprintln!("Publish using the host function!! {:?}", inputs[0]);
            outputs[0] = inputs[0].clone();
            Ok(())
        }

        let f = Function::new(
            "publish_host",
            [ValType::I64],
            [ValType::I64],
            None,
            publish_host,
        );

        let context = None;

        let plugin = PluginBuilder::new_with_module(wasm)
            .with_wasi(true)
            .with_function(f)
            .build(context)?;

        Ok(IPNSPlugin { plugin })
    }

    pub fn with_config(
        &mut self,
        config: &std::collections::BTreeMap<String, Option<String>>,
    ) -> Result<&mut Self> {
        self.plugin.set_config(config)?;
        Ok(self)
    }

    pub fn sign_and_publish(
        &mut self,
        input: impl AsRef<[u8]>,
    ) -> Result<ipns_plugin_interface::Message> {
        let data = self.plugin.call("sign_and_publish", input)?;

        // convert bytes to string
        let data_str = std::str::from_utf8(data)?;

        match serde_json::from_str(data_str) {
            Ok(d) => Ok(d),
            Err(e) => Err(Error::msg(format!("Error: {:?}", e))),
        }
    }
}

#[cfg(test)]
mod plugin_tests {
    use super::IPNSPlugin;
    use anyhow::Result;
    use ipns_plugin_interface::SignPublish;
    use libp2p_identity::ed25519::SecretKey;
    const WASM: &[u8] =
        include_bytes!("../../../../target/wasm32-wasi/release/ipns_plugin_bindings.wasm");

    #[test]
    fn it_signs_and_publishes() -> Result<()> {
        let thing = "this".to_string();
        let mut config = std::collections::BTreeMap::new();
        config.insert("thing".to_string(), Some(thing));

        let mut plugin = IPNSPlugin::new(WASM)?;
        plugin.with_config(&config)?;

        let secret = SecretKey::generate().as_ref().to_vec();
        let data = "somecid".to_string();

        // convert secret into a Json map of string to serde_json::Value
        let secret: serde_json::Map<String, serde_json::Value> = secret
            .iter()
            .enumerate()
            .map(|(i, v)| {
                (
                    i.to_string(),
                    serde_json::Value::Number(serde_json::Number::from(*v)),
                )
            })
            .collect();

        let input = SignPublish { secret, data };

        // json serialize
        let serzd = serde_json::to_string(&input)?;

        eprintln!("serzd: {:?}", serzd);

        let published = plugin.sign_and_publish(serzd)?;

        eprintln!("published: {:?}", published);

        Ok(())
    }
}
