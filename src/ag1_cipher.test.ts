import assert from 'assert';
import { describe, it } from 'node:test';
import { decodeAG1Request, encodeAG1Request, decodeAG1Response, encodeAG1Response } from './ag1_cipher';

describe('#ag1', () => {
  it('should be able to encrypt and decrypt request data', async () => {
    const fixture = '{"hello":"ag1!"}';
    const cipher = await encodeAG1Request(fixture);
    const decrypted = await decodeAG1Request(cipher);
    assert.strictEqual(decrypted, fixture, 'Decrypted data does not match original');
  });

  it('should be able to decrypt AG1 request data', async () => {
    const expected = '{"hello":"ag1!"}';
    const fixture = 'UVKyyaPxYeBs+e6kkEeQpwwnsRmO4NI5JTdJvqrvU3w3elv4W1kcb8G35S4=';
    const decrypted = await decodeAG1Request(new Uint8Array(Buffer.from(fixture, 'base64')));
    assert.strictEqual(decrypted, expected, 'Decrypted AG1 request does not match expected');
  });

  it('should be able to encrypt and decrypt AG1 response data', () => {
    const fixture = '{"code":0,"ts":0,"start_ts":100,"traceid":"ffffffffffffffff"}';
    const encrypted = encodeAG1Response(fixture);
    const decrypted = decodeAG1Response(encrypted.buffer);
    assert.strictEqual(decrypted, fixture, 'Decrypted AG1 response does not match original');
  });

  it('should be able to decrypt AG1 response data', () => {
    const fixture = Buffer.from(
      'AR3vcjr+DTBcYVz/bBhmrSIJHD7gCEvTaS25FTtcfVKpa0g9/mtCC2i7WFnqezj9SWwKKxjteVw6+2gJEg==',
      'base64',
    );
    const expected = '{"code":0,"ts":0,"start_ts":100,"traceid":"ffffffffffffffff"}';
    const decrypted = decodeAG1Response(new Uint8Array(fixture));
    assert.strictEqual(decrypted, expected, 'Decrypted AG1 response does not match expected');
  });
});
