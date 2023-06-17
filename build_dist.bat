cargo build --package ipns-wit --release --target wasm32-wasi
mkdir "dist/ipns-wit"
wasm-tools component new  ./target/wasm32-wasi/release/ipns_wit.wasm --adapt wasi_snapshot_preview1=./wasi_preview1_component_adapter.wasm -o dist/ipns-wit/ipns_wit.component.wasm
jco transpile ./dist/ipns-wit/ipns_wit.component.wasm -o ./dist/ipns-wit/js
