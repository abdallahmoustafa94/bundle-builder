import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

/** Checkout CTA — swaps to a local "Order confirmed" state (placeholder for a real flow). */
export function CheckoutButton() {
  const [checkedOut, setCheckedOut] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => setCheckedOut(true)}
      whileHover={!checkedOut ? { scale: 1.01 } : {}}
      whileTap={!checkedOut ? { scale: 0.98 } : {}}
      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[4px] bg-wyze-purple py-[13px] text-[17px] font-bold text-white transition-colors hover:bg-wyze-purple-dark"
    >
      <AnimatePresence mode="wait" initial={false}>
        {checkedOut ? (
          <motion.span
            key="confirmed"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center gap-2"
          >
            <Check size={18} strokeWidth={3} /> Order confirmed
          </motion.span>
        ) : (
          <motion.span key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            Checkout
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
