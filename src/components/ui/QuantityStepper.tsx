import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

interface QuantityStepperProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  decrementDisabled?: boolean;
  /** `card` = product-card stepper; `review` = compact review-line stepper. */
  variant?: 'card' | 'review';
  label?: string;
}

export function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement,
  decrementDisabled,
  variant = 'card',
  label = 'Quantity',
}: QuantityStepperProps) {
  const disabled = decrementDisabled ?? quantity <= 0;
  const isCard = variant === 'card';
  const gapClass = isCard ? 'gap-[10px]' : 'gap-2';
  const buttonClass = 'h-5 w-5';
  const iconSize = isCard ? 8 : 9;

  const minusClass = isCard
    ? quantity <= 1
      ? 'bg-white border-2 border-[#e6ebf0] rounded-[4px]'
      : 'bg-[#f0f4f7] border-2 border-[#f0f4f7] rounded-[4px]'
    : 'bg-white rounded-[4px]';

  const plusClass = isCard
    ? 'bg-[#f0f4f7] rounded-[4px]'
    : 'bg-white rounded-[4px] hover:bg-gray-100';

  const numberClass = isCard
    ? 'min-w-[1rem] text-[16px] font-medium leading-[20px]'
    : 'min-w-[1rem] text-[14px] font-semibold';

  // Slide direction from the previous quantity (adjust-state-during-render stays in sync).
  const [prevQuantity, setPrevQuantity] = useState(quantity);
  const [direction, setDirection] = useState(0);
  if (quantity !== prevQuantity) {
    setDirection(quantity > prevQuantity ? 1 : -1);
    setPrevQuantity(quantity);
  }

  const slideY = direction * 8;

  return (
    <div className={cn('inline-flex items-center', gapClass)} role="group" aria-label={label}>
      <motion.button
        type="button"
        onClick={onDecrement}
        disabled={disabled}
        aria-label="Decrease quantity"
        whileTap={!disabled ? { scale: 0.88 } : {}}
        className={cn(
          'grid cursor-pointer place-items-center text-gray-700 transition-colors',
          buttonClass,
          minusClass,
          'disabled:cursor-not-allowed disabled:text-gray-400',
        )}
      >
        <Minus size={iconSize} strokeWidth={2.5} />
      </motion.button>

      <div className={cn('relative overflow-hidden text-center tabular-nums text-obsidian', numberClass)}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={quantity}
            initial={{ y: slideY, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -slideY, opacity: 0 }}
            transition={{ duration: 0.14, ease: 'easeOut' }}
            aria-live="polite"
            className="block"
          >
            {quantity}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.button
        type="button"
        onClick={onIncrement}
        aria-label="Increase quantity"
        whileTap={{ scale: 0.88 }}
        className={cn(
          'grid cursor-pointer place-items-center text-gray-700 transition-colors',
          buttonClass,
          plusClass,
        )}
      >
        <Plus size={iconSize} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
}
