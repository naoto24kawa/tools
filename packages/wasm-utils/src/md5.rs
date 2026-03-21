use md5::Digest;

pub fn compute(input: &str) -> String {
    let mut hasher = md5::Md5::new();
    hasher.update(input.as_bytes());
    let result = hasher.finalize();
    result.iter().map(|b| format!("{:02x}", b)).collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_md5_empty() {
        assert_eq!(compute(""), "d41d8cd98f00b204e9800998ecf8427e");
    }

    #[test]
    fn test_md5_hello() {
        assert_eq!(compute("hello"), "5d41402abc4b2a76b9719d911017c592");
    }

    #[test]
    fn test_md5_unicode() {
        // MD5 of UTF-8 encoded bytes
        let hash = compute("こんにちは");
        assert_eq!(hash.len(), 32);
        assert_eq!(hash, "c0e89a293bd36c7a768e4e9d2c5475a8");
    }
}
