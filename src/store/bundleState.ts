import { Catalog, Product, Selections } from '../types';
import { resolveVariantKey } from '../lib/pricing';

export const STORAGE_KEY = 'bundle-builder:v1';

/** Build the seeded selection state straight from the catalog data. */
export function seedSelections(catalog: Catalog): Selections {
  const selections: Selections = {};
  for (const step of catalog.steps) {
    for (const product of step.products) {
      selections[product.id] = {
        activeVariantId: product.seed.activeVariant ?? defaultVariantId(product),
        quantities: { ...product.seed.quantities },
      };
    }
  }
  return selections;
}

function defaultVariantId(product: Product): string | null {
  return product.variants.length ? product.variants[0].id : null;
}

/**
 * Merge persisted selections onto a fresh seed so newly added catalog
 * products always have an entry, while saved quantities win.
 */
export function hydrateSelections(catalog: Catalog, persisted: Selections | null): Selections {
  const base = seedSelections(catalog);
  if (!persisted) return base;

  const merged: Selections = {};
  for (const step of catalog.steps) {
    for (const product of step.products) {
      const saved = persisted[product.id];
      merged[product.id] = saved
        ? {
            activeVariantId: saved.activeVariantId ?? base[product.id].activeVariantId,
            quantities: { ...saved.quantities },
          }
        : base[product.id];
    }
  }
  return merged;
}

/** Narrow unknown parsed JSON to a valid Selections map before trusting it. */
function isSelections(value: unknown): value is Selections {
  if (typeof value !== 'object' || value === null) return false;
  return Object.values(value as Record<string, unknown>).every((entry) => {
    if (typeof entry !== 'object' || entry === null) return false;
    const { activeVariantId, quantities } = entry as Record<string, unknown>;
    const activeOk =
      activeVariantId == null || typeof activeVariantId === 'string';
    if (!activeOk || typeof quantities !== 'object' || quantities === null) return false;
    return Object.values(quantities as Record<string, unknown>).every(
      (qty) => typeof qty === 'number' && Number.isFinite(qty),
    );
  });
}

export function loadPersisted(): Selections | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isSelections(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function persist(selections: Selections): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
  } catch {
    /* storage unavailable — non-fatal */
  }
}

/** The variant key the stepper currently edits for a product. */
export function activeKey(selections: Selections, product: Product): string {
  return resolveVariantKey(product, selections[product.id]?.activeVariantId);
}

// --- Reducer ---------------------------------------------------------------

export type BundleAction =
  | { type: 'setActiveVariant'; productId: string; variantId: string }
  | { type: 'setQuantity'; productId: string; variantKey: string; quantity: number }
  | { type: 'increment'; productId: string; variantKey: string }
  | { type: 'decrement'; productId: string; variantKey: string; min?: number }
  | { type: 'reset'; selections: Selections };

function updateProduct(
  state: Selections,
  productId: string,
  updater: (current: Selections[string]) => Selections[string],
): Selections {
  const current = state[productId] ?? { activeVariantId: null, quantities: {} };
  return { ...state, [productId]: updater(current) };
}

function setQty(
  state: Selections,
  productId: string,
  variantKey: string,
  quantity: number,
): Selections {
  const clamped = Math.max(0, quantity);
  return updateProduct(state, productId, (current) => ({
    ...current,
    quantities: { ...current.quantities, [variantKey]: clamped },
  }));
}

export function bundleReducer(state: Selections, action: BundleAction): Selections {
  switch (action.type) {
    case 'setActiveVariant':
      return updateProduct(state, action.productId, (current) => ({
        ...current,
        activeVariantId: action.variantId,
      }));

    case 'setQuantity':
      return setQty(state, action.productId, action.variantKey, action.quantity);

    case 'increment': {
      const currentQty = state[action.productId]?.quantities[action.variantKey] ?? 0;
      return setQty(state, action.productId, action.variantKey, currentQty + 1);
    }

    case 'decrement': {
      const currentQty = state[action.productId]?.quantities[action.variantKey] ?? 0;
      const min = action.min ?? 0;
      return setQty(state, action.productId, action.variantKey, Math.max(min, currentQty - 1));
    }

    case 'reset':
      return action.selections;

    default:
      return state;
  }
}
