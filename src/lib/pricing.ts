import {
  Catalog,
  DEFAULT_VARIANT_KEY,
  Product,
  Selections,
  Step,
  Variant,
} from '../types';

/** A single configured line, used by the review panel and totals. */
export interface BundleLine {
  key: string;
  product: Product;
  variant: Variant | null;
  category: string;
  quantity: number;
  /** Line subtotal at the active price. */
  lineTotal: number;
  /** Line subtotal at the compare-at price (falls back to active price). */
  lineCompareTotal: number;
}

export interface BundleTotals {
  lines: BundleLine[];
  /** One-time hardware subtotal (excludes monthly plan lines). */
  subtotal: number;
  /** One-time subtotal at compare-at prices. */
  compareSubtotal: number;
  savings: number;
  /** Grand total of one-time charges including shipping. */
  total: number;
  /** Sum of monthly plan charges. */
  planMonthly: number;
  /** Suggested monthly financing amount. */
  financingMonthly: number;
}

const PLAN_CATEGORY = 'Plan';

/** The quantity-map key for a product's active variant (or the default key if it has none). */
export function resolveVariantKey(
  product: Product,
  activeVariantId: string | null | undefined,
): string {
  if (!product.variants.length) return DEFAULT_VARIANT_KEY;
  return activeVariantId ?? product.variants[0].id;
}

/** Resolve the quantities map for a product, defaulting to an empty record. */
function quantitiesFor(selections: Selections, product: Product): Record<string, number> {
  return selections[product.id]?.quantities ?? {};
}

/** Total quantity of a product across every variant. */
export function totalQuantity(selections: Selections, product: Product): number {
  return Object.values(quantitiesFor(selections, product)).reduce((sum, q) => sum + q, 0);
}

/** Quantity of the product's currently active variant (what the card stepper shows). */
export function activeQuantity(selections: Selections, product: Product): number {
  const key = resolveVariantKey(product, selections[product.id]?.activeVariantId);
  return quantitiesFor(selections, product)[key] ?? 0;
}

/** Number of distinct products in a step that have at least one unit selected. */
export function stepSelectedCount(selections: Selections, step: Step): number {
  return step.products.filter((p) => totalQuantity(selections, p) > 0).length;
}

/** Build the flat list of selected lines (one per variant with qty > 0). */
export function buildLines(catalog: Catalog, selections: Selections): BundleLine[] {
  const lines: BundleLine[] = [];

  for (const step of catalog.steps) {
    for (const product of step.products) {
      const quantities = quantitiesFor(selections, product);

      const variantKeys = product.variants.length
        ? product.variants.map((v) => v.id)
        : [DEFAULT_VARIANT_KEY];

      for (const key of variantKeys) {
        const quantity = quantities[key] ?? 0;
        if (quantity <= 0) continue;

        const variant = product.variants.find((v) => v.id === key) ?? null;
        const unitCompare = product.compareAtPrice ?? product.price;

        lines.push({
          key: `${product.id}:${key}`,
          product,
          variant,
          category: step.reviewCategory,
          quantity,
          lineTotal: product.price * quantity,
          lineCompareTotal: unitCompare * quantity,
        });
      }
    }
  }

  return lines;
}

/** Group lines by their review category, sorted by reviewOrder (Figma: cameras→sensors→accessories→plan). */
export function groupLinesByCategory(catalog: Catalog, lines: BundleLine[]): [string, BundleLine[]][] {
  const steps = [...catalog.steps].sort(
    (a, b) => (a.reviewOrder ?? 999) - (b.reviewOrder ?? 999),
  );
  const seen = Array.from(new Set(steps.map((s) => s.reviewCategory)));
  return seen
    .map((category) => [category, lines.filter((l) => l.category === category)] as [string, BundleLine[]])
    .filter(([, items]) => items.length > 0);
}

/** Compute all derived totals for the configured system. */
export function computeTotals(catalog: Catalog, selections: Selections): BundleTotals {
  const lines = buildLines(catalog, selections);

  const oneTime = lines.filter((l) => l.category !== PLAN_CATEGORY);
  const planLines = lines.filter((l) => l.category === PLAN_CATEGORY);

  const subtotal = oneTime.reduce((sum, l) => sum + l.lineTotal, 0);
  const compareSubtotal = oneTime.reduce((sum, l) => sum + l.lineCompareTotal, 0);
  const shipping = catalog.shipping.free ? 0 : catalog.shipping.price;
  const total = subtotal + shipping;
  const planMonthly = planLines.reduce((sum, l) => sum + l.lineTotal, 0);

  return {
    lines,
    subtotal,
    compareSubtotal,
    savings: compareSubtotal - subtotal,
    total,
    planMonthly,
    financingMonthly: catalog.financingMonths > 0 ? total / catalog.financingMonths : 0,
  };
}
