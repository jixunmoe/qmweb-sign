/**
 * Sign a message, using "zzc" variant of the algorithm.
 * @param text input text
 */
export function zzcSign(text: string): string;

/**
 * Encrypt a JSON string to Base64 encoded payload for "ag-1" encoded request.
 * @param data JSON string to encode
 * @returns Base64 encoded payload
 */
export async function encodeAG1Request(data: string): Promise<string>;

/**
 * Decrypt response from "ag-1" encoded request.
 * @param data ArrayBuffer or Uint8Array containing the encrypted response
 * @returns Decrypted response, typically a JSON string
 */
export function decodeAG1Response(data: ArrayBuffer | Uint8Array): string;
