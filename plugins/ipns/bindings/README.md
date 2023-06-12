# Required Config

To build Plugin Binding in Rust to Wasm:

1. WASI Target needs to be set, either in `cargo build --release --target wasm32-wasi` or in `.cargo/config.toml`:

```toml
# .cargo/config.toml
[build]
target = "wasm32-wasi"
```

2. `CDynamic Library` needs to be set to build to wasm in `Cargo.toml`:

```toml
# Cargo.toml
[lib]
crate-type = ["cdylib"]
```

3. Build or Watch and build

```sh
cargo build --release
```

or

```sh
cargo watch -s "cargo build --release"
```
