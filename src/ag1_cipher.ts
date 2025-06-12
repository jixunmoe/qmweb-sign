const responseKey = new Uint8Array([
  122, 63, 140, 29, 94, 155, 47, 10, 108, 77, 126, 139, 31, 58, 92, 157, 14, 43, 111, 74, 129,
]);
const requestKey = new Uint8Array([189, 48, 95, 16, 208, 255, 116, 182, 239, 84, 218, 184, 53, 181, 225, 207]);

// AG1:
// - https://y.qq.com/ryqq/js/vendor.chunk.bfbed3466d0f57ee7041.js
// - https://web.archive.org/web/20250528/https://y.qq.com/ryqq/js/vendor.chunk.bfbed3466d0f57ee7041.js

export async function encodeAG1Request(data: string): Promise<Uint8Array> {
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);

  const textEncoder = new TextEncoder();
  const encoded = textEncoder.encode(data);

  const key = await crypto.subtle.importKey('raw', requestKey, 'AES-GCM', false, ['encrypt']);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);

  const finalData = new Uint8Array(iv.length + encrypted.byteLength);
  finalData.set(iv);
  finalData.set(new Uint8Array(encrypted), iv.length);
  return new Uint8Array(finalData);
}

export async function decodeAG1Request(data: Uint8Array): Promise<string> {
  const iv = data.slice(0, 12);
  const encryptedData = data.slice(12);

  const key = await crypto.subtle.importKey('raw', requestKey, 'AES-GCM', false, ['decrypt']);
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encryptedData);
  const textDecoder = new TextDecoder();
  return textDecoder.decode(new Uint8Array(decrypted));
}

export function decodeAG1Response(data: ArrayBuffer | Uint8Array): string {
  const response = new Uint8Array(data);
  response.forEach((c, i, arr) => {
    arr[i] = c ^ responseKey[i % responseKey.length];
  });
  return new TextDecoder().decode(response);
}

export function encodeAG1Response(data: string): Uint8Array {
  const response = new Uint8Array(new TextEncoder().encode(data));
  response.forEach((c, i, arr) => {
    arr[i] = c ^ responseKey[i % responseKey.length];
  });
  return response;
}
