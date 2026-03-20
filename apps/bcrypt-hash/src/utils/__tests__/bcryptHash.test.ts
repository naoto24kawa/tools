import { describe, expect, test } from "vitest";
import { generateHash, verifyHash } from "../bcryptHash";

describe("bcryptHash", () => {
  test("generates a valid bcrypt hash", async () => {
    const hash = await generateHash("password", 4);
    expect(hash).toMatch(/^\$2[aby]?\$\d{2}\$/);
  });

  test("verify returns true for correct password", async () => {
    const hash = await generateHash("test123", 4);
    expect(await verifyHash("test123", hash)).toBe(true);
  });

  test("verify returns false for wrong password", async () => {
    const hash = await generateHash("test123", 4);
    expect(await verifyHash("wrong", hash)).toBe(false);
  });

  test("verify returns false for invalid hash", async () => {
    expect(await verifyHash("test", "invalidhash")).toBe(false);
  });

  test("different rounds produce different length computation", async () => {
    const hash4 = await generateHash("test", 4);
    const hash8 = await generateHash("test", 8);
    expect(hash4).toMatch(/^\$2[aby]?\$/);
    expect(hash8).toMatch(/^\$2[aby]?\$/);
    expect(hash4).not.toBe(hash8);
  });
});
