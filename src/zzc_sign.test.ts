import assert from 'node:assert';
import { it, describe } from 'node:test';

import { zzcSign as zzcSignNode } from './node';
import { zzcSign as zzcSignWeb } from './web';

const fixture = [
  ['123', 'zzcec1b555gzqzg7laztguyjl2bu20r6x1w50c55f60'],
  ['hello world', 'zzcfb3415bc4nfoxmd9uik71mkomtubjfjp141a1cbbcc'],
  ['jixun.uk', 'zzcf47b78apso27mjjbbzgbof0szikfkvyqc7fc3a2b5'],
];

describe("#zzcSign", () => {
  for (const [platform, sign] of [['node', zzcSignNode], ['web', zzcSignWeb]] as const) {
    it(`should work on ${platform}`, () => {
      for (const [text, expected] of fixture) {
        assert.strictEqual(sign(text), expected, `zzcSign(${text}) failed`);
      }
    });
  }
});