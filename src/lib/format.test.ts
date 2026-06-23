import { describe, it, expect } from 'vitest';
import { formatPrice } from './format';

describe('formatPrice', () => {
  it('formats USD with two decimals and a $ sign', () => {
    expect(formatPrice(27.98)).toBe('$27.98');
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(5)).toBe('$5.00');
  });

  it('groups thousands', () => {
    expect(formatPrice(1234.5)).toBe('$1,234.50');
  });

  it('honors a non-default currency', () => {
    // Symbol/format vary by currency; assert the amount is present and it isn't USD.
    const eur = formatPrice(10, 'EUR');
    expect(eur).toContain('10');
    expect(eur).not.toBe('$10.00');
  });
});
