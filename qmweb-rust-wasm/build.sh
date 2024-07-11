#!/usr/bin/env bash -ex

# Use nightly
rustup install nightly-x86_64-unknown-linux-gnu
rustup component add rust-src --toolchain nightly-x86_64-unknown-linux-gnu

export RUSTFLAGS="-Zlocation-detail=none"
rustup run nightly wasm-pack build -d pkg --target web --out-name qmweb_sign --release . \
    -Z trim-paths \
    -Z unstable-options \
    -Z build-std=std,panic_abort \
    -Z build-std-features=std/optimize_for_size,panic_immediate_abort

node build.js

cp pkg/qmweb_sign.d.ts pkg/qmweb_sign_loader.d.ts
cp pkg/qmweb_sign.d.ts pkg/qmweb_sign_loader.mjs.d.ts
