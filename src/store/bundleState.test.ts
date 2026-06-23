import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Selections } from '../types';
import {
  STORAGE_KEY,
  seedSelections,
  hydrateSelections,
  bundleReducer,
  loadPersisted,
  persist,
} from './bundleState';
import { catalog } from '../test/fixtures';

describe('seedSelections', () => {
  it('builds an entry for every product from its seed', () => {
    const seed = seedSelections(catalog);
    expect(seed.cam).toEqual({ activeVariantId: 'white', quantities: { white: 1 } });
    expect(seed.hub.quantities).toEqual({ _default: 1 });
    expect(seed.plan.quantities).toEqual({ _default: 1 });
  });
});

describe('hydrateSelections', () => {
  it('returns the seed when nothing is persisted', () => {
    expect(hydrateSelections(catalog, null)).toEqual(seedSelections(catalog));
  });

  it('lets saved quantities win but keeps unseen products from the seed', () => {
    const persisted: Selections = {
      cam: { activeVariantId: 'black', quantities: { black: 3 } },
    };
    const merged = hydrateSelections(catalog, persisted);
    expect(merged.cam).toEqual({ activeVariantId: 'black', quantities: { black: 3 } });
    // hub/plan weren't persisted, so they fall back to the seed.
    expect(merged.hub).toEqual(seedSelections(catalog).hub);
  });
});

describe('bundleReducer', () => {
  const base = seedSelections(catalog);

  it('increments a specific variant', () => {
    const next = bundleReducer(base, { type: 'increment', productId: 'cam', variantKey: 'white' });
    expect(next.cam.quantities.white).toBe(2);
  });

  it('decrement respects a minimum (required products stay >= 1)', () => {
    const next = bundleReducer(base, {
      type: 'decrement',
      productId: 'hub',
      variantKey: '_default',
      min: 1,
    });
    expect(next.hub.quantities._default).toBe(1);
  });

  it('setQuantity never goes below zero', () => {
    const next = bundleReducer(base, {
      type: 'setQuantity',
      productId: 'cam',
      variantKey: 'white',
      quantity: -5,
    });
    expect(next.cam.quantities.white).toBe(0);
  });

  it('switches the active variant without touching quantities', () => {
    const next = bundleReducer(base, {
      type: 'setActiveVariant',
      productId: 'cam',
      variantId: 'black',
    });
    expect(next.cam.activeVariantId).toBe('black');
    expect(next.cam.quantities).toEqual(base.cam.quantities);
  });
});

describe('persistence', () => {
  beforeEach(() => {
    const store = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => void store.set(k, String(v)),
      removeItem: (k: string) => void store.delete(k),
      clear: () => store.clear(),
    } as unknown as Storage);
  });

  it('round-trips a valid selection', () => {
    const seed = seedSelections(catalog);
    persist(seed);
    expect(loadPersisted()).toEqual(seed);
  });

  it('returns null for non-JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json {');
    expect(loadPersisted()).toBeNull();
  });

  it('rejects a structurally invalid payload', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ cam: { activeVariantId: 'white', quantities: { white: 'oops' } } }),
    );
    expect(loadPersisted()).toBeNull();
  });
});
