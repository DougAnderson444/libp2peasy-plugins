#!/bin/bash

# 1) cargo build --release
cargo build --release

# 2) copy target\wasm32-wasi\release\ipns_plugin_bindings.wasm to dist folder
cp ../../../target/wasm32-wasi/release/ipns_plugin_bindings.wasm ../../../dist/ipns_plugin_bindings.wasm
