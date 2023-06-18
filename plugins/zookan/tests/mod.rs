// tests using the wasm component

use anyhow::Result;
use wasmtime::component::{Component, Linker};
use wasmtime::{Config, Engine, Store};
use wasmtime_wasi::preview2::wasi;
use wasmtime_wasi::preview2::{Table, WasiCtx, WasiCtxBuilder, WasiView};

// Use the WIT world named smoke at ./wit
wasmtime::component::bindgen!({
    path: "wit",
    world: "delanocreds",
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
impl peerpiper::smoke::imports::Host for MyImports {
    async fn thunk(&mut self, msg: String) -> Result<String> {
        self.hit = true;
        println!("in the host");
        let new_msg = format!("{} ({})", msg, "from the host");
        Ok(new_msg)
    }

    async fn prnt(&mut self, msg: String) -> Result<()> {
        println!("in the host: {msg}");
        Ok(())
    }
}

/// Helper function to abstract the instantiation of the WASM module
/// [`Smoke`] is the name of the WIT world we're using
pub async fn instantiate(
    component: Component,
    wasi_ctx: MyImports,
) -> Result<(Store<MyImports>, Smoke)> {
    let mut linker = Linker::new(&ENGINE);

    // add wasi io, filesystem, clocks, cli_base, random, poll
    wasi::command::add_to_linker(&mut linker)?;

    // link OUR imports
    Smoke::add_to_linker(&mut linker, |x| x)?;

    let mut store = Store::new(&ENGINE, wasi_ctx);

    let (reactor, _instance) = Smoke::instantiate_async(&mut store, &component, &linker).await?;
    Ok((store, reactor))
}

#[tokio::main(flavor = "current_thread")]
async fn main() -> wasmtime::Result<()> {
    // time execution
    let wasm = std::env::var("CARGO_PKG_NAME")?.replace('-', "_");
    let component = Component::from_file(&ENGINE, format!("dist/{wasm}.component.wasm"))?;

    let mut table = Table::new();
    let wasi = WasiCtxBuilder::new()
        .set_args(&["gussie", "sparky", "willa"])
        .build(&mut table)?;

    let (mut store, smoke_reactor) = instantiate(
        component,
        MyImports {
            hit: false,
            wasi_ctx: Context { table, wasi },
        },
    )
    .await?;

    let out = smoke_reactor
        .call_think(&mut store, "original message")
        .await?;

    let thx = smoke_reactor
        .peerpiper_smoke_demo()
        .call_thank(&mut store, "god")
        .await?;

    smoke_reactor.direct().call_pank(&mut store).await?;

    assert!(store.data().hit);

    Ok(())
}
