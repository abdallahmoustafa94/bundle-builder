import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBundle } from '../../store/bundleContext';
import { computeTotals, groupLinesByCategory } from '../../lib/pricing';
import { ReviewLineItem } from './ReviewLineItem';
import { ReviewPlanLine } from './ReviewPlanLine';
import { ReviewSummary } from './ReviewSummary';

export function ReviewPanel() {
  const { catalog, selections, formatPrice } = useBundle();

  const totals = useMemo(() => computeTotals(catalog, selections), [catalog, selections]);
  const groups = useMemo(() => groupLinesByCategory(catalog, totals.lines), [catalog, totals.lines]);

  return (
    <aside className="rounded-[10px] bg-panel flex flex-col gap-[5px] pt-[15px]">
      <div className="px-[15px]">
        <p className="eyebrow">Review</p>
      </div>

      {/*
        Mobile:  flex-col (stacked)
        Tablet (md, below lg): flex-row — line items left, checkout right
        Desktop (lg): flex-col again (inside narrow 380px column)
      */}
      <div className="pb-[31px] pt-[20px] px-[20px] flex flex-col gap-[10px] md:flex-row md:items-start md:gap-[52px] xl:flex-col xl:gap-[10px]">

        {/* LEFT: header + category line items */}
        <div className="flex flex-col gap-[10px] md:flex-1 xl:w-auto">
          <div className="flex flex-col gap-[5px] tracking-[0.6px]">
            <h2 className="text-[22px] lg:text-[28px] xl:text-[22px] font-semibold leading-none text-obsidian">
              Your security system
            </h2>
            <p className="text-[14px] font-medium leading-[1.3] text-[rgba(31,31,31,0.75)]">
              Review your personalized protection system designed to keep what matters most safe.
            </p>
          </div>

          <div className="flex flex-col gap-[10px]">
            <AnimatePresence initial={false}>
              {groups.length === 0 && (

                <motion.p
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="py-8 text-center text-sm text-gray-600"
                >
                  Your system is empty. Add items from the builder to get started.
                </motion.p>
              )}

              {groups.map(([category, lines]) => (
                <motion.section
                  key={category}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.22 }}
                  className="border-t border-gray-400 pt-[15px] flex flex-col gap-[8px]"
                >
                  <h3 className="text-[12px] font-normal uppercase tracking-[0.03em] text-gray-500">
                    {category}
                  </h3>
                  <div className="flex flex-col gap-[8px]">
                    <AnimatePresence initial={false}>
                      {lines.map((line) =>
                        category === 'Plan' ? (
                          <ReviewPlanLine key={line.key} line={line} />
                        ) : (
                          <ReviewLineItem key={line.key} line={line} />
                        ),
                      )}
                    </AnimatePresence>
                  </div>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>

          {/* Shipping row — always in left column (below line items) */}
          <div className="flex items-center gap-4 border-t border-gray-400 py-2.5 xl:py-0">
            <div className="grid h-[41px] w-[41px] shrink-0 place-items-center overflow-hidden rounded-[5px] bg-white">
              <img src="/images/delivery.svg" alt="" className="h-[29px] w-[29px]" />
            </div>
            <p className="flex-1 text-[14px] font-medium text-obsidian">{catalog.shipping.label}</p>
            <div className="shrink-0 text-right">
              <p className="text-[14px] font-medium text-gray-600 line-through">{formatPrice(catalog.shipping.price)}</p>
              <p className="text-[14px] font-semibold text-wyze-purple">
                {catalog.shipping.free ? 'FREE' : formatPrice(catalog.shipping.price)}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: guarantee + totals + checkout */}
        {/* At md this becomes a fixed-width right column; at lg it flows below */}
        <div className="md:w-[45%] md:shrink-0 xl:w-auto">
          <ReviewSummary catalog={catalog} totals={totals} />
        </div>
      </div>
    </aside>
  );
}
