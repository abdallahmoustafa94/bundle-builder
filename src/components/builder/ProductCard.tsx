import { motion } from 'framer-motion';
import { Product } from '../../types';
import { cn } from '../../lib/cn';
import { useBundle } from '../../store/bundleContext';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Price } from '../ui/Price';
import { VariantSelector } from './VariantSelector';

export function ProductCard({ product }: { product: Product }) {
  const {
    cardQuantity,
    productQuantity,
    activeVariantId,
    setActiveVariant,
    incrementCard,
    decrementCard,
  } = useBundle();

  const quantity = cardQuantity(product);
  const selected = productQuantity(product) > 0;
  const decrementDisabled = product.required ? quantity <= 1 : quantity <= 0;

  return (
    <motion.div
      layout
      animate={{
        borderColor: selected ? 'rgba(78,47,210,0.7)' : 'transparent',
      }}
      transition={{ borderColor: { duration: 0.2 } }}
      className={cn(
        'flex h-full flex-row items-start overflow-clip rounded-[10px] border-2 bg-white p-[11px] gap-[10px] wide:h-[331px] xl:h-full',
        selected ? 'xl:gap-[19px]' : 'xl:gap-[13px]',
      )}
    >
      <div className="relative h-[115px] w-[88px] shrink-0 overflow-clip rounded-[5px] bg-white sm:h-[130px] sm:w-[96px] md:h-[137px] md:w-[101px]">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain"
        />
        {product.badge && (
          <motion.span
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute left-0 top-0 rounded-[10px] bg-wyze-purple px-[6px] py-[2px] text-[12px] font-semibold leading-normal text-white"
          >
            {product.badge}
          </motion.span>
        )}
      </div>

      {/* Details column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Name + description + Learn More */}
        <div className="flex flex-col gap-[8px]">
          <h3 className="text-[16px] lg:text-[18px] xl:text-[16px] font-semibold leading-none tracking-[0.6px] text-ink">
            {product.name}
          </h3>
          <p className="text-[12px] lg:text-[14px] xl:text-[12px] font-medium leading-[1.3] tracking-[0.6px] text-ink/75">
            {product.description}{' '}
            <a
              href={product.learnMoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0000ee] underline transition-opacity hover:opacity-70"
            >
              Learn More
            </a>
          </p>
        </div>

        {/* Variant chips */}
        {product.variants.length > 0 && (
          <div className="mt-[10px]">
            <VariantSelector
              variants={product.variants}
              activeVariantId={activeVariantId(product)}
              onSelect={(id) => setActiveVariant(product, id)}
            />
          </div>
        )}

        {/* Stepper + price */}
        <div className="mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-[10px]">
          <div className="shrink-0">
            <QuantityStepper
              quantity={quantity}
              onIncrement={() => incrementCard(product)}
              onDecrement={() => decrementCard(product)}
              decrementDisabled={decrementDisabled}
              label={`${product.name} quantity`}
            />
          </div>
          <div className="ml-auto shrink-0">
            <Price
              price={product.price}
              compareAtPrice={product.compareAtPrice}
              suffix={product.priceSuffix}
              free={product.free}
              variant="card"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
