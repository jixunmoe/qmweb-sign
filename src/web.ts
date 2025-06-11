import { sha1 } from 'js-sha1';
import { fromByteArray, toByteArray } from 'base64-js';
import { zzcSign as _zzcSign } from './zzc_sign';
import {
  decodeAG1Response,
  encodeAG1Request as _encodeAG1Request,
  decodeAG1Request as _decodeAG1Request,
} from './ag1_cipher';

function base64Encode(data: number[]): string {
  return fromByteArray(new Uint8Array(data)).replace(/[\\/+=]/g, '');
}

export function zzcSign(text: string): string {
  return _zzcSign(text, sha1, base64Encode);
}

export async function encodeAG1Request(data: string): Promise<string> {
  const encoded = await _encodeAG1Request(data);
  return fromByteArray(encoded);
}

/**
 * @private Not tested.
 */
export async function decodeAG1Request(data: string): Promise<string> {
  const decoded = toByteArray(data);
  return _decodeAG1Request(new Uint8Array(decoded));
}

export { decodeAG1Response };
