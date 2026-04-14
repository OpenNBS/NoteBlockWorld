import { describe, expect, it } from 'bun:test';

import { z } from 'zod';

import { jsonStringField } from './jsonStringField.js';

describe('jsonStringField', () => {
  it('parses a valid JSON string and validates against the inner schema', () => {
    const schema = jsonStringField(z.array(z.string()));
    const result = schema.safeParse('["a","b"]');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(['a', 'b']);
    }
  });

  it('parses a JSON object string when the inner schema is an object', () => {
    const schema = jsonStringField(z.object({ n: z.number(), s: z.string() }));
    const result = schema.safeParse('{"n":1,"s":"x"}');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ n: 1, s: 'x' });
    }
  });

  it('turns invalid JSON into a Zod custom issue instead of throwing', () => {
    const schema = jsonStringField(z.array(z.string()));
    const inputs = ['{', 'not json', '', '{"unclosed": true'];

    for (const input of inputs) {
      const result = schema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        const custom = result.error.issues.filter((i) => i.code === 'custom');
        expect(custom.length).toBeGreaterThanOrEqual(1);
        expect(custom.some((i) => i.message === 'Invalid JSON string')).toBe(
          true,
        );
      }
    }
  });

  it('does not classify valid JSON that fails the inner schema as invalid JSON', () => {
    const schema = jsonStringField(z.array(z.string()));
    const result = schema.safeParse('123');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some((i) => i.message === 'Invalid JSON string'),
      ).toBe(false);
    }
  });

  it('rejects non-string input at the outer string schema', () => {
    const schema = jsonStringField(z.array(z.string()));
    const result = schema.safeParse(['already', 'an', 'array'] as unknown);

    expect(result.success).toBe(false);
  });
});
