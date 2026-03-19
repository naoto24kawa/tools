import { describe, it, expect } from 'vitest';
import { formatHcl } from '../terraformFormatter';

describe('formatHcl', () => {
  it('returns empty string for empty input', () => {
    const result = formatHcl('');
    expect(result.formatted).toBe('');
    expect(result.changed).toBe(false);
  });

  it('formats basic resource block', () => {
    const input = `resource "aws_instance" "example" {
ami = "abc-123"
instance_type = "t2.micro"
}`;
    const result = formatHcl(input);
    expect(result.formatted).toContain('  ami = "abc-123"');
    expect(result.formatted).toContain('  instance_type = "t2.micro"');
  });

  it('handles nested blocks', () => {
    const input = `resource "aws_instance" "example" {
ami = "abc-123"
tags = {
Name = "test"
}
}`;
    const result = formatHcl(input);
    expect(result.formatted).toContain('  tags = {');
    expect(result.formatted).toContain('    Name = "test"');
  });

  it('preserves comments', () => {
    const input = `# This is a comment
resource "null_resource" "test" {
# inner comment
}`;
    const result = formatHcl(input);
    expect(result.formatted).toContain('# This is a comment');
    expect(result.formatted).toContain('  # inner comment');
  });

  it('preserves empty lines', () => {
    const input = `variable "name" {}\n\nvariable "age" {}`;
    const result = formatHcl(input);
    expect(result.formatted).toContain('\n\n');
  });

  it('warns about unbalanced braces', () => {
    const input = `resource "test" "test" {
  name = "test"`;
    const result = formatHcl(input);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain('Unbalanced');
  });

  it('handles already formatted code', () => {
    const input = `resource "aws_s3_bucket" "example" {
  bucket = "my-bucket"
  acl    = "private"
}
`;
    const result = formatHcl(input);
    expect(result.formatted).toBe(input);
    expect(result.changed).toBe(false);
  });

  it('handles inline comments', () => {
    const input = `variable "name" {
default = "test" # default value
}`;
    const result = formatHcl(input);
    expect(result.formatted).toContain('default = "test" # default value');
  });
});
