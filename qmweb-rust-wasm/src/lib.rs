#![no_std]

extern crate wee_alloc;
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

use base64::prelude::*;
use sha1::{Digest, Sha1};
use sha1::digest::FixedOutput;
use wasm_bindgen::prelude::*;

const INDEXES_PART_1: [usize; 7] = [23, 14, 6, 36, 16, /*40,*/ 7, 19];
const INDEXES_PART_2: [usize; 8] = [16, 1, 32, 12, 19, 27, 8, 5];
const SCRAMBLE_VALUES: [u8; 20] = [
    89, 39, 179, 150, 218, 82, 58, 252, 177, 52, 186, 123, 120, 64, 242, 133, 143, 161, 121, 179,
];

#[wasm_bindgen(js_name = s)]
pub fn zzc_sign(output: &mut [u8], input: &str) -> usize {
    let mut hasher = Sha1::new();
    hasher.update(input);
    let digest = hasher.finalize_fixed();
    let mut digest_hex = [0u8; 20 * 2];
    if let Err(_err) = hex::encode_to_slice(digest, &mut digest_hex) {
        output[..16].copy_from_slice(b"err: hex_encode\0");
        return 0;
    }

    let mut part1 = [0; 7];
    let mut part2 = [0; 8];
    let mut part3 = [0u8; 20];
    for (i, &idx) in INDEXES_PART_1.iter().enumerate() {
        part1[i] = digest_hex[idx];
    }
    for (i, &idx) in INDEXES_PART_2.iter().enumerate() {
        part2[i] = digest_hex[idx];
    }
    for (i, &scramble_value) in SCRAMBLE_VALUES.iter().enumerate() {
        part3[i] = digest[i] ^ scramble_value
    }
    let mut part3_b64 = [0u8; 32];
    let mut part3_final = [0u8; 32];
    if BASE64_STANDARD.encode_slice(part3, &mut part3_b64).is_err() {
        output[..16].copy_from_slice(b"err: b64_encode\0");
        return 0;
    };

    let mut b64_pos = 0usize;
    for b in part3_b64 {
        if matches!(b, b'0'..=b'9' | b'a'..=b'z' | b'A'..=b'Z') {
            part3_final[b64_pos] = b.to_ascii_lowercase();
            b64_pos += 1;
        }
    }

    let total_len = 3 + part1.len() + b64_pos + part2.len();
    let (left, right) = output.split_at_mut(3);
    left.copy_from_slice(b"zzc");
    let (left, right) = right.split_at_mut(part1.len());
    left.copy_from_slice(&part1);
    let (left, right) = right.split_at_mut(b64_pos);
    left.copy_from_slice(&part3_final[..b64_pos]);
    let (left, right) = right.split_at_mut(part2.len());
    left.copy_from_slice(&part2);
    right[0] = 0;

    total_len
}

#[test]
fn test_zzc_sign() {
    {
        let mut buffer = [0u8; 64];
        let sign_len = zzc_sign(&mut buffer, "123");
        assert_eq!(sign_len, 43);
        assert_eq!(
            b"zzcec1b555gzqzg7laztguyjl2bu20r6x1w50c55f60",
            &buffer[..43]
        );
    }

    {
        let mut buffer = [0u8; 64];
        let sign_len = zzc_sign(&mut buffer, "hello world");
        assert_eq!(sign_len, 45);
        assert_eq!(
            b"zzcfb3415bc4nfoxmd9uik71mkomtubjfjp141a1cbbcc",
            &buffer[..45]
        );
    }
}
