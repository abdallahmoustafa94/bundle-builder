import { motion } from 'framer-motion';
import { Variant } from '../../types';

interface VariantSelectorProps {
  variants: Variant[];
  activeVariantId: string | null;
  onSelect: (variantId: string) => void;
}

export function VariantSelector({ variants, activeVariantId, onSelect }: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className="flex flex-wrap gap-[6px]" role="radiogroup" aria-label="Color">
      {variants.map((variant) => {
        const active = variant.id === activeVariantId;
        return (
          <motion.button
            key={variant.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(variant.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              borderColor: active ? '#0aa288' : '#CCCCCC',
              backgroundColor: active ? 'rgba(10,162,136,0.04)' : '#ffffff',
            }}
            transition={{ duration: 0.15 }}
            className="inline-flex h-[26px] cursor-pointer items-center gap-[2px] rounded-[2px] border-[0.5px] px-[3px] py-px text-[10px] font-medium tracking-[0.06em] text-ink"
          >
            {variant.chipImage ? (
              <img
                src={variant.chipImage}
                alt=""
                aria-hidden
                className="h-[22px] w-[22px] shrink-0 rounded-[5px] object-cover"
              />
            ) : (
              <span
                className="h-[18px] w-[18px] shrink-0 rounded-[5px] border border-black/10"
                style={{ backgroundColor: variant.swatch }}
                aria-hidden
              />
            )}
            {variant.label}
          </motion.button>
        );
      })}
    </div>
  );
}
