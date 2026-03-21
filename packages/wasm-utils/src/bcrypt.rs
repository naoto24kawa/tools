pub fn hash_password(password: &str, rounds: u32) -> Result<String, String> {
    bcrypt::hash(password, rounds).map_err(|e| e.to_string())
}

pub fn verify_password(password: &str, hash: &str) -> bool {
    bcrypt::verify(password, hash).unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_bcrypt_hash_and_verify() {
        let hash = hash_password("test_password", 4).expect("hashing should succeed");
        assert!(hash.starts_with("$2b$04$"));
        assert!(verify_password("test_password", &hash));
    }

    #[test]
    fn test_bcrypt_verify_wrong_password() {
        let hash = hash_password("correct", 4).expect("hashing should succeed");
        assert!(!verify_password("wrong", &hash));
    }
}
