# Plugin Development Kit (PDK) for Libp2p

This repository contains the PDK for Libp2p. It is a collection of libraries and tools that can be used to build Libp2p plugins.

## Usage

The [examples] folder will contain examples of how to use the PDK.

TODO: This is a hackathon, everything is still in TODO!

## Plugins

### IPNS

The plugin does two things:

1. `on_message`, it listens for any pubsub messages that match the IPNS topic and stores them in the browser's local storage.
2. `on_publish`, it encodes the record in IPNS and publishes it to the IPNS topic.

## Frontend - See the Demo in Action!

```sh
cd frontend
npm install
npm run dev
```

## Architecture / Spec

Specification of the Plugin interface

image from frontend/static/architecture.svg

[![architecture](frontend/static/architecture.svg)](frontend/static/architecture.svg)

## Build Rust Workspace

`cargo build --workspace`
