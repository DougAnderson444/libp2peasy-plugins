use anyhow::Result;
use libp2p_identity::ed25519::SecretKey;
use wasmtime::component::{Component, Linker};
use wasmtime::{Config, Engine, Store};
use wasmtime_wasi::preview2::wasi;
use wasmtime_wasi::preview2::{Table, WasiCtx, WasiCtxBuilder, WasiView};

// Use the WIT world named ipns-pubsub at ./wit
wasmtime::component::bindgen!({
    path: "wit",
    world: "ipns-pubsub",
    async: true
});

lazy_static::lazy_static! {
    static ref ENGINE: Engine = {
        let mut config = Config::new();
        config.wasm_backtrace_details(wasmtime::WasmBacktraceDetails::Enable);
        config.wasm_component_model(true);
        config.async_support(true);

        Engine::new(&config).unwrap()
    };
}

/// Struct to hold the data we want to pass in
/// plus the WASI properties in order to use WASI
pub struct MyImports {
    hit: bool,
    wasi_ctx: Context,
}

struct Context {
    table: Table,
    wasi: WasiCtx,
}

// We need to impl to be able to use the WASI linker add_to_linker
impl WasiView for MyImports {
    fn table(&self) -> &Table {
        &self.wasi_ctx.table
    }
    fn table_mut(&mut self) -> &mut Table {
        &mut self.wasi_ctx.table
    }
    fn ctx(&self) -> &WasiCtx {
        &self.wasi_ctx.wasi
    }
    fn ctx_mut(&mut self) -> &mut WasiCtx {
        &mut self.wasi_ctx.wasi
    }
}

/// Implementations of the host functions
#[async_trait::async_trait]
impl peerpiper::ipns_pubsub::imports::Host for MyImports {
    async fn prnt(&mut self, msg: String) -> Result<()> {
        println!("From host: {msg}");
        Ok(())
    }
    async fn publish(&mut self, msg: peerpiper::ipns_pubsub::types::Message) -> Result<()> {
        println!("Host publish: {msg:?}");
        Ok(())
    }
    async fn subscribe(&mut self, msg: String) -> Result<()> {
        println!("Host subscribe: {msg}");
        Ok(())
    }
    async fn unsubscribe(&mut self, msg: String) -> Result<()> {
        println!("Host unsubscribe: {msg}");
        Ok(())
    }
}

impl peerpiper::ipns_pubsub::types::Host for MyImports {}

/// Helper function to abstract the instantiation of the WASM module
/// [`IpnsPubsub`] is the name of the WIT world we're using
pub async fn instantiate(
    component: Component,
    wasi_ctx: MyImports,
) -> Result<(Store<MyImports>, IpnsPubsub)> {
    let mut linker = Linker::new(&ENGINE);

    // add wasi io, filesystem, clocks, cli_base, random, poll
    wasi::command::add_to_linker(&mut linker)?;

    // link OUR imports
    IpnsPubsub::add_to_linker(&mut linker, |x| x)?;

    let mut store = Store::new(&ENGINE, wasi_ctx);

    let (reactor, _instance) =
        IpnsPubsub::instantiate_async(&mut store, &component, &linker).await?;
    Ok((store, reactor))
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> wasmtime::Result<()> {
    // time execution
    let wasm = std::env::var("CARGO_PKG_NAME")?.replace('-', "_");

    let start = std::time::Instant::now();

    let component = Component::from_file(&ENGINE, format!("dist/ipns-wit/{wasm}.component.wasm"))?;

    // time to read file
    let last = start.elapsed();
    eprintln!("Time elapsed in reading file is: {:?}", last);

    let mut table = Table::new();
    let wasi = WasiCtxBuilder::new()
        .set_args(&["gussie", "sparky", "willa"])
        .build(&mut table)?;

    let (mut store, reactor) = instantiate(
        component,
        MyImports {
            hit: false,
            wasi_ctx: Context { table, wasi },
        },
    )
    .await?;

    // time to load
    eprintln!(
        "Time elapsed in loading is: {:?} (+{:?})",
        start.elapsed(),
        start.elapsed() - last
    );
    let last = start.elapsed();

    let secret = SecretKey::generate().as_ref().to_vec();
    let cid = "QmHashSomeCid".to_string();

    let msg: peerpiper::ipns_pubsub::types::Message =
        match reactor.call_publish(&mut store, &cid, &secret).await? {
            Ok(msg) => msg,
            Err(e) => {
                eprintln!("Error: {:?}", e);
                return Ok(());
            }
        };

    eprintln!("Published message: {:?}", msg);
    eprintln!("Using Secret: {:?} ", secret);
    eprintln!("Topic: {:?} ", &msg.topic.clone());

    reactor
        .call_subscribe(&mut store, &msg.topic.clone())
        .await?;
    reactor
        .call_unsubscribe(&mut store, &msg.topic.clone())
        .await?;

    Ok(())
}
