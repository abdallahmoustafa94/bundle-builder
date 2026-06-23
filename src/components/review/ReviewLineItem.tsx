import { motion } from 'framer-motion';
import { DEFAULT_VARIANT_KEY } from '../../types';
import { BundleLine } from '../../lib/pricing';
import { useBundle } from '../../store/bundleContext';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Price } from '../ui/Price';

export function ReviewLineItem({ line }: { line: BundleLine }) {
  const { increment, decrement } = useBundle();
  const { product, variant } = line;
  const variantKey = variant?.id ?? DEFAULT_VARIANT_KEY;
  const decrementDisabled = product.required ? line.quantity <= 1 : line.quantity <= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, marginTop: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex items-center gap-4 py-0"
    >
      <div className="grid h-[41px] w-[41px] shrink-0 place-items-center overflow-hidden rounded-[5px] bg-white">
        <img src={product.image} alt="" className="h-full w-full object-contain" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-medium leading-[16px] tracking-[0.07px] text-obsidian">{product.name}</p>
        {variant && <p className="sr-only">{variant.label}</p>}
      </div>

      <QuantityStepper
        variant="review"
        quantity={line.quantity}
        onIncrement={() => increment(product, variantKey)}
        onDecrement={() => decrement(product, variantKey)}
        decrementDisabled={decrementDisabled}
        label={`${product.name} quantity`}
      />

      <div className="shrink-0 text-right xl:w-[52px]">
        <Price
          price={line.lineTotal}
          compareAtPrice={product.compareAtPrice != null ? line.lineCompareTotal : null}
          free={product.free}
          variant="review"
          align="right"
        />
      </div>
    </motion.div>
  );
}
