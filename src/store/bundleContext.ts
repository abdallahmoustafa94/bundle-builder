import { createContext, useContext } from 'react';
import { Catalog, Product, Selections } from '../types';

export interface BundleContextValue {
  catalog: Catalog;
  selections: Selections;
  /** Quantity shown on a product card (its active variant). */
  cardQuantity: (product: Product) => number;
  /** Total quantity across all of a product's variants. */
  productQuantity: (product: Product) => number;
  activeVariantId: (product: Product) => string | null;
  setActiveVariant: (product: Product, variantId: string) => void;
  /** Increment/decrement the active variant (used by the card stepper). */
  incrementCard: (product: Product) => void;
  decrementCard: (product: Product) => void;
  /** Set a specific variant's quantity (used by the review-panel steppers). */
  setQuantity: (product: Product, variantKey: string, quantity: number) => void;
  increment: (product: Product, variantKey: string) => void;
  decrement: (product: Product, variantKey: string) => void;
  saveForLater: () => void;
  resetToSeed: () => void;
  justSaved: boolean;
  /** Currency formatter bound to the catalog's currency. */
  formatPrice: (value: number) => string;
}

export const BundleContext = createContext<BundleContextValue | null>(null);

export function useBundle(): BundleContextValue {
  const ctx = useContext(BundleContext);
  if (!ctx) throw new Error('useBundle must be used within a BundleProvider');
  return ctx;
}
