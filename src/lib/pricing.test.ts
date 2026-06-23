import { describe, it, expect } from 'vitest';
import { DEFAULT_VARIANT_KEY, Selections } from '../types';
import {
  resolveVariantKey,
  totalQuantity,
  activeQuantity,
  stepSelectedCount,
  buildLines,
  groupLinesByCategory,
  computeTotals,
} from './pricing';
import { catalog, products } from '../test/fixtures';
import { seedSelections } from '../store/bundleState';

const { cam, hub } = products;

describe('resolveVariantKey', () => {
  it('returns the default key for products without variants', () => {
    expect(resolveVariantKey(hub, null)).toBe(DEFAULT_VARIANT_KEY);
  });

  it('returns the active variant when set', () => {
    expect(resolveVariantKey(cam, 'black')).toBe('black');
  });

  it('falls back to the first variant when none is active', () => {
    expect(resolveVariantKey(cam, null)).toBe('white');
  });
});

describe('quantities', () => {
  const selections: Selections = {
    cam: { activeVariantId: 'black', quantities: { white: 2, black: 1 } },
  };

  it('totalQuantity sums across every variant', () => {
    expect(totalQuantity(selections, cam)).toBe(3);
  });

  it('activeQuantity returns only the active variant count', () => {
    expect(activeQuantity(selections, cam)).toBe(1); // black is active
  });

  it('activeQuantity is 0 for an untouched product', () => {
    expect(activeQuantity({}, cam)).toBe(0);
  });
});

describe('stepSelectedCount', () => {
  it('counts distinct products with at least one unit', () => {
    const selections: Selections = {
      cam: { activeVariantId: 'white', quantities: { white: 0, black: 0 } },
    };
    expect(stepSelectedCount(selections, catalog.steps[0])).toBe(0);
    selections.cam.quantities.white = 1;
    expect(stepSelectedCount(selections, catalog.steps[0])).toBe(1);
  });
});

describe('buildLines', () => {
  it('emits one line per variant with qty > 0', () => {
    const selections: Selections = {
      cam: { activeVariantId: 'white', quantities: { white: 2, black: 1 } },
    };
    const lines = buildLines(catalog, selections).filter((l) => l.product.id === 'cam');
    expect(lines).toHaveLength(2);
    expect(lines.map((l) => l.variant?.id).sort()).toEqual(['black', 'white']);
    const white = lines.find((l) => l.variant?.id === 'white')!;
    expect(white.quantity).toBe(2);
    expect(white.lineTotal).toBeCloseTo(55.96);
  });
});

describe('groupLinesByCategory', () => {
  it('orders groups by reviewOrder (Cameras, Sensors, Plan)', () => {
    const lines = buildLines(catalog, seedSelections(catalog));
    const groups = groupLinesByCategory(catalog, lines).map(([category]) => category);
    expect(groups).toEqual(['Cameras', 'Sensors', 'Plan']);
  });
});

describe('computeTotals (from the seeded catalog)', () => {
  const totals = computeTotals(catalog, seedSelections(catalog));

  it('excludes monthly plan lines from the one-time subtotal', () => {
    // cam $27.98 + free hub $0 = $27.98; the $9.99 plan is not in the subtotal.
    expect(totals.subtotal).toBeCloseTo(27.98);
  });

  it('reports the monthly plan charge separately', () => {
    expect(totals.planMonthly).toBeCloseTo(9.99);
  });

  it('computes savings from compare-at prices', () => {
    // compare: cam 35.98 + hub 29.92 = 65.90; savings = 65.90 - 27.98
    expect(totals.compareSubtotal).toBeCloseTo(65.9);
    expect(totals.savings).toBeCloseTo(37.92);
  });

  it('adds free shipping as zero and derives financing from financingMonths', () => {
    expect(totals.total).toBeCloseTo(27.98);
    expect(totals.financingMonthly).toBeCloseTo(2.798);
  });
});
