use base64::prelude::*;
use sha1::{Digest, Sha1};
use sha1::digest::FixedOutput;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

const INDEXES_PART_1: [usize; 7] = [23, 14, 6, 36, 16, /*40,*/ 7, 19];
const INDEXES_PART_2: [usize; 8] = [16, 1, 32, 12, 19, 27, 8, 5];
const SCRAMBLE_VALUES: [u8; 20] = [
    89, 39, 179, 150, 218, 82, 58, 252, 177, 52, 186, 123, 120, 64, 242, 133, 143, 161, 121, 179,
];

#[wasm_bindgen(js_name = zzcSign)]
pub fn zzc_sign(input: &str) -> String {
    let mut hasher = Sha1::new();
    hasher.update(input);
    let digest = hasher.finalize_fixed();
    let mut digest_hex = [0u8; 20 * 2];
    if let Err(_err) = hex::encode_to_slice(digest, &mut digest_hex) {
        return String::from("err:hex");
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
    let part3 = BASE64_STANDARD.encode(part3);
    let part3: String = part3
        .chars()
        .filter(|&x| !matches!(x, '/' | '\\' | '+' | '='))
        .collect();

    format!(
        "zzc{}{}{}",
        String::from_utf8_lossy(&part1),
        part3,
        String::from_utf8_lossy(&part2)
    )
    .to_lowercase()
}

#[test]
fn test_zzc_sign() {
    assert_eq!(
        zzc_sign("123"),
        "zzcec1b555gzqzg7laztguyjl2bu20r6x1w50c55f60"
    );
    assert_eq!(
        zzc_sign("hello world"),
        "zzcfb3415bc4nfoxmd9uik71mkomtubjfjp141a1cbbcc"
    );
}
