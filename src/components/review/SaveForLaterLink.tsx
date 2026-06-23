import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useBundle } from '../../store/bundleContext';

/** Persists the current configuration and shows a transient confirmation. */
export function SaveForLaterLink() {
  const { saveForLater, justSaved } = useBundle();

  return (
    <div className="flex flex-col items-center gap-1 mt-1">
      <button
        type="button"
        onClick={saveForLater}
        className="cursor-pointer text-[14px] italic text-[#484848] underline underline-offset-2 transition-colors hover:text-obsidian"
      >
        Save my system for later
      </button>
      <AnimatePresence>
        {justSaved && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1 text-[12px] font-semibold text-wyze-purple"
          >
            <Check size={13} strokeWidth={3} /> Saved to this browser
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
