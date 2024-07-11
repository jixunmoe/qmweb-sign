import assert from 'node:assert';
import { zzcSign as zzcSignNode } from './node';
import { zzcSign as zzcSignWeb } from './web';
const { zzcSign: zzcSignWasm } = require('../dist/wasm.cjs') as any;

const fixture = [
  ['123', 'zzcec1b555gzqzg7laztguyjl2bu20r6x1w50c55f60'],
  ['hello world', 'zzcfb3415bc4nfoxmd9uik71mkomtubjfjp141a1cbbcc'],
  ['jixun.uk', 'zzcf47b78apso27mjjbbzgbof0szikfkvyqc7fc3a2b5'],
];

for (const [text, expected] of fixture) {
  assert.strictEqual(zzcSignNode(text), expected, `node/sign(${text}) failed`);
  assert.strictEqual(zzcSignWeb(text), expected, `web/sign(${text}) failed`);
  assert.strictEqual(zzcSignWasm(text), expected, `wasm/sign(${text}) failed`);
}

console.log('test ok!');
