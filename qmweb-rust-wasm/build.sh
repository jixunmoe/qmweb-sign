#!/usr/bin/env bash

wasm-pack build -d pkg --target web --out-name qmweb_sign --release .
node build.js

cp pkg/qmweb_sign.d.ts pkg/qmweb_sign_loader.d.ts
cp pkg/qmweb_sign.d.ts pkg/qmweb_sign_loader.mjs.d.ts
