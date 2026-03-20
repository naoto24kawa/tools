pub mod bcrypt;
pub mod crc32;
pub mod deflate;
pub mod md5;

use wasm_bindgen::prelude::*;

/// Compute MD5 hash of a string input, returned as a hex string.
#[wasm_bindgen]
pub fn md5(input: &str) -> String {
    md5::compute(input)
}

/// Compute CRC32 checksum of a string input, returned as a hex string.
#[wasm_bindgen]
pub fn crc32_hex(input: &str) -> String {
    crc32::crc32_hex(input)
}

/// Compute CRC32 checksum of raw bytes, returned as a u32.
#[wasm_bindgen]
pub fn crc32_raw(input: &[u8]) -> u32 {
    crc32::crc32_raw(input)
}

/// Hash a password using bcrypt with the specified number of rounds.
#[wasm_bindgen]
pub fn bcrypt_hash(password: &str, rounds: u32) -> Result<String, JsValue> {
    bcrypt::hash_password(password, rounds).map_err(|e| JsValue::from_str(&e))
}

/// Verify a password against a bcrypt hash.
#[wasm_bindgen]
pub fn bcrypt_verify(password: &str, hash: &str) -> bool {
    bcrypt::verify_password(password, hash)
}

/// Compress data using Deflate algorithm.
#[wasm_bindgen]
pub fn deflate(input: &[u8], level: u8) -> Vec<u8> {
    deflate::compress(input, level)
}

/// Decompress Deflate-compressed data.
#[wasm_bindgen]
pub fn inflate(input: &[u8]) -> Result<Vec<u8>, JsValue> {
    deflate::decompress(input).map_err(|e| JsValue::from_str(&e))
}
