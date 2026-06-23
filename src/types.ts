// Shared domain types for the bundle builder.

/** Quantity key used for products that have no color variants. */
export const DEFAULT_VARIANT_KEY = '_default';

export interface Variant {
  id: string;
  label: string;
  /** Hex color shown as the swatch dot in the variant selector (fallback). */
  swatch: string;
  /** Product thumbnail shown inside the variant chip (replaces color swatch). */
  chipImage?: string;
}

export interface ProductSeed {
  activeVariant: string | null;
  /** Initial quantities keyed by variant id (or DEFAULT_VARIANT_KEY). */
  quantities: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  /** Optional brand fragment rendered before the name (e.g. plan "Cam"). */
  brandName?: string;
  description: string;
  learnMoreUrl: string;
  badge: string | null;
  image: string;
  price: number;
  compareAtPrice: number | null;
  /** e.g. "/mo" for subscription plans. */
  priceSuffix?: string | null;
  /** When true the active price renders as "FREE". */
  free?: boolean;
  /** Required products can't be reduced below 1. */
  required?: boolean;
  variants: Variant[];
  seed: ProductSeed;
}

export interface Step {
  id: string;
  stepLabel: string;
  title: string;
  /** Heading used to group this step's items in the review panel. */
  reviewCategory: string;
  /** Sort order in the review panel (Figma: cameras=1, sensors=2, accessories=3, plan=4). */
  reviewOrder?: number;
  nextLabel: string | null;
  products: Product[];
}

export interface Catalog {
  currency: string;
  financingMonths: number;
  shipping: { label: string; price: number; free: boolean };
  guarantee: {
    percent: string;
    returnsTitle: string;
    blurb: string;
  };
  steps: Step[];
}

/** Per-product selection state: which variant is active and each variant's qty. */
export interface ProductSelection {
  activeVariantId: string | null;
  quantities: Record<string, number>;
}

/** Whole-system selection state, keyed by product id. Persisted to storage. */
export type Selections = Record<string, ProductSelection>;
