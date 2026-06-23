import { motion } from 'framer-motion';
import { BundleLine } from '../../lib/pricing';
import { Price } from '../ui/Price';

export function ReviewPlanLine({ line }: { line: BundleLine }) {
  const { product } = line;
  const { brandName, name } = product;
  // Strip the brand only when it's a real leading prefix (brand renders ink, rest purple).
  const remainder =
    brandName && name.startsWith(`${brandName} `) ? name.slice(brandName.length + 1) : name;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16, height: 0, marginTop: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex items-center gap-[3px] py-0"
    >
      <img
        src={product.image}
        alt=""
        className="h-[24px] w-[20px] shrink-0 object-contain"
      />

      <p className="flex-1 pl-1 text-[16px] font-bold leading-tight text-obsidian">
        {brandName && <span className="text-obsidian">{brandName} </span>}
        <span className="text-wyze-purple">{remainder}</span>
      </p>

      <div className="shrink-0 text-right xl:w-[52px]">
        <Price
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          suffix={product.priceSuffix}
          variant="review"
          align="right"
        />
      </div>
    </motion.div>
  );
}
