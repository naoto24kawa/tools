import { test, expect } from '@playwright/test';

test.describe('URL Encoder - Encoding Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should encode a simple URL', async ({ page }) => {
    const inputText = 'https://example.com/search?q=hello world';
    const expectedEncoded = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world';

    // Find the input textarea and enter text
    const inputTextarea = page.getByRole('textbox').first();
    await inputTextarea.fill(inputText);

    // Click the encode button
    const encodeButton = page.getByRole('button', { name: /エンコード/i });
    await encodeButton.click();

    // Check if the output contains the encoded text
    // Note: This assumes there's an output area. Adjust selector as needed.
    const outputTextarea = page.getByRole('textbox').nth(1);
    await expect(outputTextarea).toHaveValue(expectedEncoded);
  });

  test('should decode an encoded URL', async ({ page }) => {
    const encodedText = 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world';
    const expectedDecoded = 'https://example.com/search?q=hello world';

    // Find the input textarea and enter encoded text
    const inputTextarea = page.getByRole('textbox').first();
    await inputTextarea.fill(encodedText);

    // Click the decode button
    const decodeButton = page.getByRole('button', { name: /デコード/i });
    await decodeButton.click();

    // Check if the output contains the decoded text
    const outputTextarea = page.getByRole('textbox').nth(1);
    await expect(outputTextarea).toHaveValue(expectedDecoded);
  });

  test('should handle Japanese characters', async ({ page }) => {
    const inputText = 'こんにちは世界';
    const expectedEncoded = '%E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%E4%B8%96%E7%95%8C';

    const inputTextarea = page.getByRole('textbox').first();
    await inputTextarea.fill(inputText);

    const encodeButton = page.getByRole('button', { name: /エンコード/i });
    await encodeButton.click();

    const outputTextarea = page.getByRole('textbox').nth(1);
    await expect(outputTextarea).toHaveValue(expectedEncoded);
  });

  test('should handle special characters', async ({ page }) => {
    const inputText = '!@#$%^&*()';
    
    const inputTextarea = page.getByRole('textbox').first();
    await inputTextarea.fill(inputText);

    const encodeButton = page.getByRole('button', { name: /エンコード/i });
    await encodeButton.click();

    const outputTextarea = page.getByRole('textbox').nth(1);
    // The output should be different from input (encoded)
    const outputValue = await outputTextarea.inputValue();
    expect(outputValue).not.toBe(inputText);
    expect(outputValue.length).toBeGreaterThan(0);
  });

  test('should handle empty input', async ({ page }) => {
    const inputTextarea = page.getByRole('textbox').first();
    await inputTextarea.fill('');

    const encodeButton = page.getByRole('button', { name: /エンコード/i });
    await encodeButton.click();

    const outputTextarea = page.getByRole('textbox').nth(1);
    await expect(outputTextarea).toHaveValue('');
  });

  test('should be able to encode and then decode back', async ({ page }) => {
    const originalText = 'https://example.com/path?param=value with spaces';

    // First, encode
    const inputTextarea = page.getByRole('textbox').first();
    await inputTextarea.fill(originalText);

    const encodeButton = page.getByRole('button', { name: /エンコード/i });
    await encodeButton.click();

    const outputTextarea = page.getByRole('textbox').nth(1);
    const encodedValue = await outputTextarea.inputValue();

    // Then, decode the encoded value
    await inputTextarea.fill(encodedValue);
    
    const decodeButton = page.getByRole('button', { name: /デコード/i });
    await decodeButton.click();

    // Should get back the original text
    await expect(outputTextarea).toHaveValue(originalText);
  });
});
