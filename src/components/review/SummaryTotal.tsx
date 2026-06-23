import { motion, AnimatePresence } from 'framer-motion';
import { Money } from '../../lib/format';
import { cn } from '../../lib/cn';

interface SummaryTotalProps {
  total: number;
  compareSubtotal: number;
  showCompare: boolean;
  format: Money;
  /** Animate value changes (stacked layout) vs. render statically (tablet row). */
  animated?: boolean;
  compareSizeClass: string;
  totalSizeClass: string;
}

/** Struck-through compare price + active total. */
export function SummaryTotal({
  total,
  compareSubtotal,
  showCompare,
  format,
  animated = false,
  compareSizeClass,
  totalSizeClass,
}: SummaryTotalProps) {
  const compareClass = cn(compareSizeClass, 'font-medium text-gray-600 line-through');
  const totalClass = cn(totalSizeClass, 'font-bold leading-[32px] text-wyze-purple');

  return (
    <div className="flex items-baseline gap-2">
      {animated ? (
        <AnimatePresence mode="popLayout">
          {showCompare && (
            <motion.span
              key={compareSubtotal}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className={compareClass}
            >
              {format(compareSubtotal)}
            </motion.span>
          )}
        </AnimatePresence>
      ) : (
        showCompare && <span className={compareClass}>{format(compareSubtotal)}</span>
      )}

      {animated ? (
        <motion.span
          key={total}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className={totalClass}
        >
          {format(total)}
        </motion.span>
      ) : (
        <span className={totalClass}>{format(total)}</span>
      )}
    </div>
  );
}
