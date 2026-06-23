import { motion, AnimatePresence } from 'framer-motion';
import { Step } from '../../types';
import { useBundle } from '../../store/bundleContext';
import { stepSelectedCount } from '../../lib/pricing';
import { cn } from '../../lib/cn';
import { StepIcon } from '../ui/StepIcon';
import { ProductCard } from './ProductCard';
import CaretIcon from '../../assets/icons/caret.svg?react';

interface AccordionStepProps {
  step: Step;
  open: boolean;
  onToggle: () => void;
  onNext: () => void;
}

export function AccordionStep({ step, open, onToggle, onNext }: AccordionStepProps) {
  const { selections } = useBundle();
  const count = stepSelectedCount(selections, step);
  const panelId = `step-panel-${step.id}`;

  return (
    <div
      className={cn(
        'flex flex-col gap-[5px] transition-colors duration-200',
        open ? 'rounded-[10px] bg-panel pt-[15px] overflow-hidden' : 'items-start',
      )}
    >
      {/* Eyebrow */}
      <div className="px-[15px]">
        <p
          className="font-medium uppercase tracking-[1.6px] text-[#484848] transition-all duration-200"
          style={{ fontSize: open ? '12px' : '10px' }}
        >
          {step.stepLabel}
        </p>
      </div>

      {/* Header toggle */}
      <h2 className="w-full">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            'flex w-full items-center gap-[3px] px-[15px] py-[14px] text-left border-t-[0.5px] border-[#1f1f1f] md:py-[17px] xl:py-[20px]',
            !open && 'border-b-[0.5px]',
          )}
        >
          <span className="flex min-w-0 flex-1 items-center gap-[8px]">
            <StepIcon stepId={step.id} className="h-[26px] w-[26px] shrink-0 text-obsidian" />
            <span className="text-[22px] lg:text-[28px] xl:text-[22px] font-semibold leading-none text-obsidian">
              {step.title}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-[4px]">
            <AnimatePresence>
              {open && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.15 }}
                  className="text-[14px] font-semibold leading-[16px] text-wyze-purple"
                >
                  {count} selected
                </motion.span>
              )}
            </AnimatePresence>

            <motion.span
              animate={{ rotate: open ? 0 : 180 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="inline-flex text-wyze-purple"
            >
              <CaretIcon className="h-[7px] w-[10px]" aria-hidden focusable={false} />
            </motion.span>
          </span>
        </button>
      </h2>

      {/* `inert` keeps the collapsed (but still mounted) content out of the tab order. */}
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        style={{ overflow: 'hidden' }}
        {...(!open ? { inert: '' } : {})}
      >
        <div className="flex flex-col gap-[15px] px-[15px] pb-[20px]">
          <div className="grid grid-cols-1 items-stretch gap-[15px] sm:grid-cols-2 md:grid-cols-3 wide:grid-cols-5 xl:grid-cols-2">
            {step.products.map((product, i) => {
              const isLastOdd =
                step.products.length % 2 === 1 && i === step.products.length - 1;
              return (
                <div
                  key={product.id}
                  className={
                    isLastOdd
                      ? 'sm:col-span-2 sm:mx-auto sm:w-[calc(50%-7.5px)] md:col-span-1 md:mx-0 md:w-auto md:min-w-0 xl:col-span-2 xl:mx-auto xl:w-[calc(50%-7.5px)] xl:min-w-0'
                      : 'min-w-0'
                  }
                >
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>

          {/* Next step button */}
          {step.nextLabel && (
            <div className="flex justify-center">
              <motion.button
                type="button"
                onClick={onNext}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="h-[39px] cursor-pointer rounded-[7px] border border-wyze-purple px-[24px] text-[18px] font-semibold text-wyze-purple transition-colors hover:bg-wyze-purple hover:text-white"
              >
                {step.nextLabel}
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
