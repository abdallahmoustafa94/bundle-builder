import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Catalog, Product } from '../types';
import { activeQuantity, totalQuantity } from '../lib/pricing';
import { formatPrice as formatPriceWith } from '../lib/format';
import { BundleContext, type BundleContextValue } from './bundleContext';
import {
  activeKey,
  bundleReducer,
  hydrateSelections,
  loadPersisted,
  persist,
  seedSelections,
} from './bundleState';

export function BundleProvider({ catalog, children }: { catalog: Catalog; children: ReactNode }) {
  const [selections, dispatch] = useReducer(
    bundleReducer,
    catalog,
    (c) => hydrateSelections(c, loadPersisted()),
  );
  const [justSaved, setJustSaved] = useState(false);
  const savedTimer = useRef<number | undefined>(undefined);

  // Auto-persist so a reload or return visit always restores the system.
  useEffect(() => {
    persist(selections);
  }, [selections]);

  const minFor = useCallback(
    (product: Product) => (product.required ? 1 : 0),
    [],
  );

  const cardQuantity = useCallback(
    (product: Product) => activeQuantity(selections, product),
    [selections],
  );
  const productQuantity = useCallback(
    (product: Product) => totalQuantity(selections, product),
    [selections],
  );
  const activeVariantId = useCallback(
    (product: Product) =>
      product.variants.length ? selections[product.id]?.activeVariantId ?? product.variants[0].id : null,
    [selections],
  );

  const setActiveVariant = useCallback((product: Product, variantId: string) => {
    dispatch({ type: 'setActiveVariant', productId: product.id, variantId });
  }, []);

  const setQuantity = useCallback(
    (product: Product, variantKey: string, quantity: number) => {
      dispatch({
        type: 'setQuantity',
        productId: product.id,
        variantKey,
        quantity: Math.max(minFor(product), quantity),
      });
    },
    [minFor],
  );

  const increment = useCallback((product: Product, variantKey: string) => {
    dispatch({ type: 'increment', productId: product.id, variantKey });
  }, []);

  const decrement = useCallback(
    (product: Product, variantKey: string) => {
      dispatch({ type: 'decrement', productId: product.id, variantKey, min: minFor(product) });
    },
    [minFor],
  );

  const incrementCard = useCallback(
    (product: Product) => increment(product, activeKey(selections, product)),
    [increment, selections],
  );
  const decrementCard = useCallback(
    (product: Product) => decrement(product, activeKey(selections, product)),
    [decrement, selections],
  );

  const saveForLater = useCallback(() => {
    persist(selections);
    setJustSaved(true);
    window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setJustSaved(false), 2600);
  }, [selections]);

  const resetToSeed = useCallback(() => {
    dispatch({ type: 'reset', selections: seedSelections(catalog) });
  }, [catalog]);

  const formatPrice = useCallback(
    (value: number) => formatPriceWith(value, catalog.currency),
    [catalog.currency],
  );

  useEffect(() => () => window.clearTimeout(savedTimer.current), []);

  const value = useMemo<BundleContextValue>(
    () => ({
      catalog,
      selections,
      cardQuantity,
      productQuantity,
      activeVariantId,
      setActiveVariant,
      incrementCard,
      decrementCard,
      setQuantity,
      increment,
      decrement,
      saveForLater,
      resetToSeed,
      justSaved,
      formatPrice,
    }),
    [
      catalog,
      selections,
      cardQuantity,
      productQuantity,
      activeVariantId,
      setActiveVariant,
      incrementCard,
      decrementCard,
      setQuantity,
      increment,
      decrement,
      saveForLater,
      resetToSeed,
      justSaved,
      formatPrice,
    ],
  );

  return <BundleContext.Provider value={value}>{children}</BundleContext.Provider>;
}
