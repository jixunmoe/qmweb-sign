import crypto from 'node:crypto';
import { zzcSign as _zzcSign } from './zzc_sign';

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
