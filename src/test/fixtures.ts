import { Catalog, Product, Step } from '../types';

/** Minimal but representative catalog used across the unit tests. */

const cam: Product = {
  id: 'cam',
  name: 'Cam',
  description: 'A camera.',
  learnMoreUrl: '#',
  badge: 'Save 22%',
  image: '/cam.png',
  price: 27.98,
  compareAtPrice: 35.98,
  variants: [
    { id: 'white', label: 'White', swatch: '#EDEDED' },
    { id: 'black', label: 'Black', swatch: '#1C1C1E' },
  ],
  seed: { activeVariant: 'white', quantities: { white: 1 } },
};

const hub: Product = {
  id: 'hub',
  name: 'Sense Hub',
  description: 'Required brain of the system.',
  learnMoreUrl: '#',
  badge: null,
  image: '/hub.png',
  price: 0,
  compareAtPrice: 29.92,
  free: true,
  required: true,
  variants: [],
  seed: { activeVariant: null, quantities: { _default: 1 } },
};

const plan: Product = {
  id: 'plan',
  name: 'Cam Unlimited',
  brandName: 'Cam',
  description: 'Unlimited history.',
  learnMoreUrl: '#',
  badge: 'Best value',
  image: '/plan.svg',
  price: 9.99,
  compareAtPrice: 12.99,
  priceSuffix: '/mo',
  variants: [],
  seed: { activeVariant: null, quantities: { _default: 1 } },
};

const camerasStep: Step = {
  id: 'cameras',
  stepLabel: 'Step 1 of 4',
  title: 'Choose your cameras',
  reviewCategory: 'Cameras',
  reviewOrder: 1,
  nextLabel: 'Next: Choose your plan',
  products: [cam],
};

const sensorsStep: Step = {
  id: 'sensors',
  stepLabel: 'Step 3 of 4',
  title: 'Choose your sensors',
  reviewCategory: 'Sensors',
  reviewOrder: 2,
  nextLabel: 'Next: Add extra protection',
  products: [hub],
};

const planStep: Step = {
  id: 'plan',
  stepLabel: 'Step 2 of 4',
  title: 'Choose your plan',
  reviewCategory: 'Plan',
  reviewOrder: 4,
  nextLabel: 'Next: Choose your sensors',
  products: [plan],
};

export const catalog: Catalog = {
  currency: 'USD',
  financingMonths: 10,
  shipping: { label: 'Fast Shipping', price: 5.99, free: true },
  guarantee: {
    percent: '100%',
    returnsTitle: '30-day hassle-free returns',
    blurb: 'Refunded if you are not in love.',
  },
  // Intentionally not in reviewOrder, to exercise the sort.
  steps: [camerasStep, sensorsStep, planStep],
};

export const products = { cam, hub, plan };
