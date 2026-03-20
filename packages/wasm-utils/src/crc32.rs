pub fn crc32_hex(input: &str) -> String {
    let checksum = crc32fast::hash(input.as_bytes());
    format!("{:08x}", checksum)
}

pub fn crc32_raw(input: &[u8]) -> u32 {
    crc32fast::hash(input)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_crc32_hex_empty() {
        assert_eq!(crc32_hex(""), "00000000");
    }

    #[test]
    fn test_crc32_hex_hello() {
        assert_eq!(crc32_hex("hello"), "3610a686");
    }

    #[test]
    fn test_crc32_raw() {
        let result = crc32_raw(b"hello");
        assert_eq!(result, 0x3610a686);
    }
}
