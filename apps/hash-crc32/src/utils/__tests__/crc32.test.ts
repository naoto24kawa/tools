import { describe, expect, test } from "vitest";
import { crc32 } from "../crc32";

describe("crc32", () => {
  test("empty string", async () => {
    expect(await crc32("")).toBe("00000000");
  });
  test("hello", async () => {
    expect(await crc32("hello")).toBe("3610a686");
  });
  test("Hello World", async () => {
    expect(await crc32("Hello World")).toBe("4a17b156");
  });
  test("returns 8 char hex", async () => {
    expect(await crc32("test")).toMatch(/^[0-9a-f]{8}$/);
  });
  test("consistent", async () => {
    expect(await crc32("abc")).toBe(await crc32("abc"));
  });
  test("different input different hash", async () => {
    expect(await crc32("a")).not.toBe(await crc32("b"));
  });
});
