import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import os from 'os';

/**
 * Build a minimal valid uncompressed ZIP buffer in memory.
 * Contains a single file: hello.txt with content "Hello, ZIP!"
 */
function buildMinimalZip(): Buffer {
  const fileName = 'hello.txt';
  const fileContent = Buffer.from('Hello, ZIP!');
  const nameBuffer = Buffer.from(fileName);

  // Local file header
  const localHeader = Buffer.alloc(30 + nameBuffer.length);
  localHeader.writeUInt32LE(0x04034b50, 0); // Local file header signature
  localHeader.writeUInt16LE(20, 4);          // Version needed
  localHeader.writeUInt16LE(0, 6);           // General purpose bit flag
  localHeader.writeUInt16LE(0, 8);           // Compression method: stored
  localHeader.writeUInt16LE(0, 10);          // Last mod time
  localHeader.writeUInt16LE(0, 12);          // Last mod date
  localHeader.writeUInt32LE(0, 14);          // CRC-32 (skip for test)
  localHeader.writeUInt32LE(fileContent.length, 18); // Compressed size
  localHeader.writeUInt32LE(fileContent.length, 22); // Uncompressed size
  localHeader.writeUInt16LE(nameBuffer.length, 26);  // File name length
  localHeader.writeUInt16LE(0, 28);                  // Extra field length
  nameBuffer.copy(localHeader, 30);

  // Central directory entry
  const cdEntry = Buffer.alloc(46 + nameBuffer.length);
  cdEntry.writeUInt32LE(0x02014b50, 0);  // Central directory signature
  cdEntry.writeUInt16LE(20, 4);          // Version made by
  cdEntry.writeUInt16LE(20, 6);          // Version needed
  cdEntry.writeUInt16LE(0, 8);           // General purpose bit flag
  cdEntry.writeUInt16LE(0, 10);          // Compression method: stored
  cdEntry.writeUInt16LE(0, 12);          // Last mod time
  cdEntry.writeUInt16LE(0, 14);          // Last mod date
  cdEntry.writeUInt32LE(0, 16);          // CRC-32
  cdEntry.writeUInt32LE(fileContent.length, 20); // Compressed size
  cdEntry.writeUInt32LE(fileContent.length, 24); // Uncompressed size
  cdEntry.writeUInt16LE(nameBuffer.length, 28);  // File name length
  cdEntry.writeUInt16LE(0, 30);                  // Extra field length
  cdEntry.writeUInt16LE(0, 32);                  // File comment length
  cdEntry.writeUInt16LE(0, 34);                  // Disk number start
  cdEntry.writeUInt16LE(0, 36);                  // Internal attributes
  cdEntry.writeUInt32LE(0, 38);                  // External attributes
  cdEntry.writeUInt32LE(0, 42);                  // Relative offset of local header
  nameBuffer.copy(cdEntry, 46);

  // End of central directory record
  const cdOffset = localHeader.length + fileContent.length;
  const cdSize = cdEntry.length;
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0); // EOCD signature
  eocd.writeUInt16LE(0, 4);          // Disk number
  eocd.writeUInt16LE(0, 6);          // Start disk
  eocd.writeUInt16LE(1, 8);          // Entries on disk
  eocd.writeUInt16LE(1, 10);         // Total entries
  eocd.writeUInt32LE(cdSize, 12);    // Central directory size
  eocd.writeUInt32LE(cdOffset, 16);  // Central directory offset
  eocd.writeUInt16LE(0, 20);         // Comment length

  return Buffer.concat([localHeader, fileContent, cdEntry, eocd]);
}

/**
 * Build a minimal ZIP containing a directory entry and a file inside it.
 */
function buildZipWithDirectory(): Buffer {
  const dirName = 'mydir/';
  const fileName = 'mydir/readme.txt';
  const fileContent = Buffer.from('readme content');

  const dirNameBuffer = Buffer.from(dirName);
  const fileNameBuffer = Buffer.from(fileName);

  // Local header for directory
  const dirLocalHeader = Buffer.alloc(30 + dirNameBuffer.length);
  dirLocalHeader.writeUInt32LE(0x04034b50, 0);
  dirLocalHeader.writeUInt16LE(20, 4);
  dirLocalHeader.writeUInt16LE(0, 6);
  dirLocalHeader.writeUInt16LE(0, 8);
  dirLocalHeader.writeUInt16LE(0, 10);
  dirLocalHeader.writeUInt16LE(0, 12);
  dirLocalHeader.writeUInt32LE(0, 14);
  dirLocalHeader.writeUInt32LE(0, 18);
  dirLocalHeader.writeUInt32LE(0, 22);
  dirLocalHeader.writeUInt16LE(dirNameBuffer.length, 26);
  dirLocalHeader.writeUInt16LE(0, 28);
  dirNameBuffer.copy(dirLocalHeader, 30);

  // Local header for file
  const fileLocalHeader = Buffer.alloc(30 + fileNameBuffer.length);
  fileLocalHeader.writeUInt32LE(0x04034b50, 0);
  fileLocalHeader.writeUInt16LE(20, 4);
  fileLocalHeader.writeUInt16LE(0, 6);
  fileLocalHeader.writeUInt16LE(0, 8);
  fileLocalHeader.writeUInt16LE(0, 10);
  fileLocalHeader.writeUInt16LE(0, 12);
  fileLocalHeader.writeUInt32LE(0, 14);
  fileLocalHeader.writeUInt32LE(fileContent.length, 18);
  fileLocalHeader.writeUInt32LE(fileContent.length, 22);
  fileLocalHeader.writeUInt16LE(fileNameBuffer.length, 26);
  fileLocalHeader.writeUInt16LE(0, 28);
  fileNameBuffer.copy(fileLocalHeader, 30);

  const dirOffset = 0;
  const fileOffset = dirLocalHeader.length; // dir data is 0 bytes

  // Central directory: directory entry
  const cdDir = Buffer.alloc(46 + dirNameBuffer.length);
  cdDir.writeUInt32LE(0x02014b50, 0);
  cdDir.writeUInt16LE(20, 4);
  cdDir.writeUInt16LE(20, 6);
  cdDir.writeUInt16LE(0, 8);
  cdDir.writeUInt16LE(0, 10);
  cdDir.writeUInt16LE(0, 12);
  cdDir.writeUInt16LE(0, 14);
  cdDir.writeUInt32LE(0, 16);
  cdDir.writeUInt32LE(0, 20);
  cdDir.writeUInt32LE(0, 24);
  cdDir.writeUInt16LE(dirNameBuffer.length, 28);
  cdDir.writeUInt16LE(0, 30);
  cdDir.writeUInt16LE(0, 32);
  cdDir.writeUInt16LE(0, 34);
  cdDir.writeUInt16LE(0, 36);
  cdDir.writeUInt32LE(0x10, 38); // directory attribute
  cdDir.writeUInt32LE(dirOffset, 42);
  dirNameBuffer.copy(cdDir, 46);

  // Central directory: file entry
  const cdFile = Buffer.alloc(46 + fileNameBuffer.length);
  cdFile.writeUInt32LE(0x02014b50, 0);
  cdFile.writeUInt16LE(20, 4);
  cdFile.writeUInt16LE(20, 6);
  cdFile.writeUInt16LE(0, 8);
  cdFile.writeUInt16LE(0, 10);
  cdFile.writeUInt16LE(0, 12);
  cdFile.writeUInt16LE(0, 14);
  cdFile.writeUInt32LE(0, 16);
  cdFile.writeUInt32LE(fileContent.length, 20);
  cdFile.writeUInt32LE(fileContent.length, 24);
  cdFile.writeUInt16LE(fileNameBuffer.length, 28);
  cdFile.writeUInt16LE(0, 30);
  cdFile.writeUInt16LE(0, 32);
  cdFile.writeUInt16LE(0, 34);
  cdFile.writeUInt16LE(0, 36);
  cdFile.writeUInt32LE(0x20, 38); // file attribute
  cdFile.writeUInt32LE(fileOffset, 42);
  fileNameBuffer.copy(cdFile, 46);

  const cdOffset = dirLocalHeader.length + fileLocalHeader.length + fileContent.length;
  const cdSize = cdDir.length + cdFile.length;

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(2, 8);
  eocd.writeUInt16LE(2, 10);
  eocd.writeUInt32LE(cdSize, 12);
  eocd.writeUInt32LE(cdOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([dirLocalHeader, fileLocalHeader, fileContent, cdDir, cdFile, eocd]);
}

test.describe('ZIP Extractor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/zip-extractor');
  });

  test('should load page with correct heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ZIP Extractor' })).toBeVisible();
  });

  test('should display subtitle text', async ({ page }) => {
    await expect(
      page.getByText('Upload a ZIP file to view and extract its contents.')
    ).toBeVisible();
  });

  test('should display Upload ZIP card with dashed upload area', async ({ page }) => {
    await expect(page.getByText('Upload ZIP')).toBeVisible();
    await expect(page.getByText('Select a .zip file to inspect.')).toBeVisible();
  });

  test('should show Choose ZIP File button', async ({ page }) => {
    await expect(
      page.getByRole('button', { name: 'Choose ZIP File' })
    ).toBeVisible();
  });

  test('should show default placeholder text in upload area', async ({ page }) => {
    await expect(page.getByText('Upload a ZIP file')).toBeVisible();
  });

  test('should accept .zip file input', async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await expect(input).toHaveAttribute('accept', '.zip,application/zip');
  });

  test('should not show file list initially', async ({ page }) => {
    // Contents card only appears after upload — must not be visible before
    await expect(page.getByText(/entries/i)).not.toBeVisible();
  });

  test('should display file entries after uploading a valid ZIP', async ({ page }) => {
    const zipBuffer = buildMinimalZip();
    const tmpPath = path.join(os.tmpdir(), `test-${Date.now()}.zip`);
    fs.writeFileSync(tmpPath, zipBuffer);

    try {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles(tmpPath);

      // Contents card heading
      await expect(page.getByText(/1 entries/i)).toBeVisible({ timeout: 5000 });
      // File name appears in the list
      await expect(page.getByText('hello.txt')).toBeVisible();
    } finally {
      fs.unlinkSync(tmpPath);
    }
  });

  test('should show file size after uploading a valid ZIP', async ({ page }) => {
    const zipBuffer = buildMinimalZip();
    const tmpPath = path.join(os.tmpdir(), `test-${Date.now()}.zip`);
    fs.writeFileSync(tmpPath, zipBuffer);

    try {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles(tmpPath);

      await expect(page.getByText('hello.txt')).toBeVisible({ timeout: 5000 });
      // formatSize(11) → "11.0 B"
      await expect(page.getByText('11.0 B')).toBeVisible();
    } finally {
      fs.unlinkSync(tmpPath);
    }
  });

  test('should show Download button for file entries', async ({ page }) => {
    const zipBuffer = buildMinimalZip();
    const tmpPath = path.join(os.tmpdir(), `test-${Date.now()}.zip`);
    fs.writeFileSync(tmpPath, zipBuffer);

    try {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles(tmpPath);

      await expect(page.getByText('hello.txt')).toBeVisible({ timeout: 5000 });
      // Download icon button should be present for the file
      const downloadBtn = page.locator('[class*="rounded-md"] button').first();
      await expect(downloadBtn).toBeVisible();
    } finally {
      fs.unlinkSync(tmpPath);
    }
  });

  test('should update ZIP name label after file is chosen', async ({ page }) => {
    const zipBuffer = buildMinimalZip();
    const tmpPath = path.join(os.tmpdir(), `my-archive.zip`);
    fs.writeFileSync(tmpPath, zipBuffer);

    try {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles(tmpPath);

      await expect(page.getByText('my-archive.zip')).toBeVisible({ timeout: 5000 });
    } finally {
      fs.unlinkSync(tmpPath);
    }
  });

  test('should show directory and file entries for a ZIP with a folder', async ({ page }) => {
    const zipBuffer = buildZipWithDirectory();
    const tmpPath = path.join(os.tmpdir(), `test-dir-${Date.now()}.zip`);
    fs.writeFileSync(tmpPath, zipBuffer);

    try {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles(tmpPath);

      await expect(page.getByText(/2 entries/i)).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('mydir/')).toBeVisible();
      await expect(page.getByText('mydir/readme.txt')).toBeVisible();
    } finally {
      fs.unlinkSync(tmpPath);
    }
  });

  test('should show error alert for an invalid file', async ({ page }) => {
    const tmpPath = path.join(os.tmpdir(), `not-a-zip-${Date.now()}.zip`);
    fs.writeFileSync(tmpPath, Buffer.from('this is not a zip file'));

    try {
      const input = page.locator('input[type="file"]');
      await input.setInputFiles(tmpPath);

      await expect(page.getByRole('alert')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText(/invalid zip/i)).toBeVisible();
    } finally {
      fs.unlinkSync(tmpPath);
    }
  });
});
