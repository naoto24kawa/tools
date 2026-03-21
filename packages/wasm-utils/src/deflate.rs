use flate2::read::{DeflateDecoder, DeflateEncoder};
use flate2::Compression;
use std::io::Read;

pub fn compress(input: &[u8], level: u8) -> Result<Vec<u8>, String> {
    let compression = Compression::new(level.min(9) as u32);
    let mut encoder = DeflateEncoder::new(input, compression);
    let mut compressed = Vec::new();
    encoder.read_to_end(&mut compressed)
        .map_err(|e| format!("compression failed: {}", e))?;
    Ok(compressed)
}

pub fn decompress(input: &[u8]) -> Result<Vec<u8>, String> {
    let mut decoder = DeflateDecoder::new(input);
    let mut decompressed = Vec::new();
    decoder
        .read_to_end(&mut decompressed)
        .map_err(|e| format!("decompression failed: {}", e))?;
    Ok(decompressed)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_compress_decompress_roundtrip() {
        // Use repetitive data to ensure compression actually reduces size
        let original = "Hello, World! ".repeat(100);
        let original = original.as_bytes();
        let compressed = compress(original, 6).expect("compression should succeed");
        assert!(compressed.len() < original.len());
        let decompressed = decompress(&compressed).expect("decompression should succeed");
        assert_eq!(decompressed, original);
    }

    #[test]
    fn test_decompress_invalid_data() {
        let invalid = vec![0xFF, 0xFE, 0xFD];
        let result = decompress(&invalid);
        assert!(result.is_err());
    }
}
