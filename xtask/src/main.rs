//! Build the wasm32-wasi and Encode the Wasm Component into the dist folder for use
//!
use std::env;
use wit_wasm_xtask::try_main;
use wit_wasm_xtask::types::{DistConfig, Profile, Target};

#[tokio::main(flavor = "current_thread")]
async fn main() {
    // pakcage name and package id
    let pkgs = [
        "ipns-wit",
        "file:///C:/Users/douga/Documents2/code/RUST-projects/libp2peasy-plugins/ipns-wit@.1.0",
        "libp2peasy-plugins/plugins/ipns-wit",
    ]; // List of plugin to componentize

    let task = env::args().nth(1); // 'dist'

    // 2nd arg if available should be "release", if not release or not present, then set to "debug"
    let profile = match env::args().nth(2).unwrap_or_else(|| "debug".to_string()) {
        ref s if s == "release" => Profile::Release,
        _ => Profile::Debug,
    };

    // TODO; for multiple packages, we need to iterate over the pkgs and call try_main for each.
    // changing out the package name and js_out_dir for each.

    let config = DistConfig {
        target: Target::Wasi,
        profile,
        dist_dir: "dist".to_string(),
        js_out_dir: "dist/js".to_string(),
        package: "ipns-wit".to_string(),
        pkgid: pkgs[0].to_string(), //  wit_wasm_xtask::utils::workspace_dir()
                                    //     .join("plugins")
                                    //     .join("ipns-wit")
                                    //     .into_os_string()
                                    //     .into_string()
                                    //     .unwrap(),
    };

    if let Err(e) = try_main(&task, &config).await {
        eprintln!("{}", e);
        std::process::exit(-1);
    }
}
