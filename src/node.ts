import crypto from 'node:crypto';
import { zzcSign as _zzcSign } from './zzc_sign';
import {
  decodeAG1Response,
  encodeAG1Request as _encodeAG1Request,
  decodeAG1Request as _decodeAG1Request,
} from './ag1_cipher';

function hashSHA1(text: string): string {
  const sha1Inst = crypto.createHash('sha1');
  sha1Inst.update(Buffer.from(text, 'utf-8'));
  return sha1Inst.digest().toString('hex').toUpperCase();
}

function base64Encode(data: Buffer | number[]): string {
  return Buffer.from(data)
    .toString('base64')
    .replace(/[\\/+=]/g, '');
}

export function zzcSign(text: string): string {
  return _zzcSign(text, hashSHA1, base64Encode);
}

export async function encodeAG1Request(data: string): Promise<string> {
  const encoded = await _encodeAG1Request(data);
  return Buffer.from(encoded).toString('base64');
}

/**
 * @private Not tested.
 */
export async function decodeAG1Request(data: string): Promise<string> {
  const decoded = Buffer.from(data, 'base64');
  return _decodeAG1Request(new Uint8Array(decoded));
}

export { decodeAG1Response };
