use anyhow::Result;
use wasmtime::component::{Component, Linker};
use wasmtime::{Config, Engine, Store};
use wasmtime_wasi::preview2::wasi;
use wasmtime_wasi::preview2::{Table, WasiCtx, WasiCtxBuilder, WasiView};

// Use the WIT world named smoke at ./wit
wasmtime::component::bindgen!({
    path: "plugins/wit-ipns/wit",
    world: "smoke",
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
impl mypackage::smoke::imports::Host for MyImports {
    async fn thunk(&mut self, msg: String) -> Result<String> {
        self.hit = true;
        println!("in the host");
        let new_msg = format!("{} ({})", msg, "from the host");
        Ok(new_msg)
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

async fn setup(component: Component, args: &[impl AsRef<str>]) -> wasmtime::Result<()> {
    let mut table = Table::new();
    let wasi = WasiCtxBuilder::new().set_args(args).build(&mut table)?;

    let (mut store, reactor) = instantiate(
        component,
        MyImports {
            hit: false,
            wasi_ctx: Context { table, wasi },
        },
    )
    .await?;

    let out = reactor.call_think(&mut store, "original message").await?;

    Ok(())
}

#[cfg(test)]
mod tests {

    use super::*;

    #[tokio::test]
    async fn test_think() -> wasmtime::Result<()> {
        // get component wasm bytes from dist/wit_ions.component.wasm
        let wasm = "wit-wasm".replace('-', "_");
        let component = Component::from_file(&ENGINE, format!("./dist/wit_ipns.component.wasm"))?;
        let args = &["gussie", "sparky", "willa"];
        let result = setup(component, args).await;
        Ok(())
    }

    // #[tokio::test]
    // async fn test_call_X() -> wasmtime::Result<()> {
    //     // get component wasm bytes from dist/wit_ions.component.wasm
    //     let wasm = "wit-wasm".replace('-', "_");
    //     let component = Component::from_file(&ENGINE, format!("dist/{wasm}.component.wasm"))?;
    //     let args = &["gussie", "sparky", "willa"];
    //     let result = setup(component, args).await;
    //     Ok(())
    // }
}
