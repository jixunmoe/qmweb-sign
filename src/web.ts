import { sha1 } from 'js-sha1';
import { fromByteArray } from 'base64-js';
import { zzcSign as _zzcSign } from './zzc_sign';

function base64Encode(data: number[]): string {
  return fromByteArray(new Uint8Array(data)).replace(/[\\/+=]/g, '');
}

export function zzcSign(text: string): string {
  return _zzcSign(text, sha1, base64Encode);
}
