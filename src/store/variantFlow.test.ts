import { describe, it, expect } from 'vitest';
import { Selections } from '../types';
import { bundleReducer, seedSelections } from './bundleState';
import { activeQuantity, totalQuantity, buildLines } from '../lib/pricing';
import { catalog, products } from '../test/fixtures';

const { cam } = products;

/**
 * End-to-end check of the brief's key requirement: each variant keeps its own
 * count, the card stepper tracks the active variant, and the review panel lists
 * every variant with qty > 0 as its own line.
 */
describe('variant selection flow', () => {
  it('tracks per-variant quantities independently and reflects them in the review lines', () => {
    let state: Selections = seedSelections(catalog); // cam seeded white: 1

    // Add a second White (now 2).
    state = bundleReducer(state, { type: 'increment', productId: 'cam', variantKey: 'white' });
    expect(activeQuantity(state, cam)).toBe(2);

    // Switch the card to Black — stepper should now read Black's count (0)...
    state = bundleReducer(state, { type: 'setActiveVariant', productId: 'cam', variantId: 'black' });
    expect(activeQuantity(state, cam)).toBe(0);
    // ...while the 2 White are untouched.
    expect(totalQuantity(state, cam)).toBe(2);

    // Add 1 Black.
    state = bundleReducer(state, { type: 'increment', productId: 'cam', variantKey: 'black' });
    expect(activeQuantity(state, cam)).toBe(1);
    expect(totalQuantity(state, cam)).toBe(3);

    // The review panel shows both variants as separate lines.
    const camLines = buildLines(catalog, state).filter((l) => l.product.id === 'cam');
    expect(camLines).toHaveLength(2);
    const byVariant = Object.fromEntries(camLines.map((l) => [l.variant?.id, l.quantity]));
    expect(byVariant).toEqual({ white: 2, black: 1 });
  });
});
