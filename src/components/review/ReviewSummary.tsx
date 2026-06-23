import { motion, AnimatePresence } from 'framer-motion';
import { Catalog } from '../../types';
import { BundleTotals } from '../../lib/pricing';
import { useBundle } from '../../store/bundleContext';
import { GuaranteeBadge } from './GuaranteeBadge';
import { FinancingPill } from './FinancingPill';
import { SummaryTotal } from './SummaryTotal';
import { CheckoutButton } from './CheckoutButton';
import { SaveForLaterLink } from './SaveForLaterLink';

export function ReviewSummary({ catalog, totals }: { catalog: Catalog; totals: BundleTotals }) {
  const { formatPrice } = useBundle();
  const { guarantee } = catalog;
  const hasSavings = totals.savings > 0;

  return (
    <div className="flex flex-col gap-[8px]">
      {/*
        Desktop (lg): badge inline with "as low as" pill + prices
        Tablet (md-lg): badge + guarantee copy text, then pill + prices in separate justify-between row
        Mobile (<md): same as desktop
      */}
      <div className="border-t border-gray-400 py-4 md:border-t-0 md:py-0 xl:border-t xl:py-4">
        {/* Badge row */}
        <div className="flex items-center gap-3 md:gap-[25px]">
          <GuaranteeBadge
            percent={guarantee.percent}
            className="h-[78px] w-[78px] md:h-[90px] md:w-[90px] lg:h-[131px] lg:w-[131px] xl:h-[78px] xl:w-[78px] shrink-0"
          />

          {/* Tablet only — guarantee copy (from the catalog) */}
          <div className="hidden md:flex xl:hidden flex-col gap-1">
            <p className="text-[14px] lg:text-[18px] font-semibold leading-[1.1] text-obsidian">
              {guarantee.returnsTitle}
            </p>
            <p className="text-[14px] lg:text-[18px] leading-[1.1] text-[rgba(31,31,31,0.75)]">
              {guarantee.blurb}
            </p>
          </div>

          {/* Mobile + Desktop — "as low as" pill + stacked, animated prices */}
          <div className="flex flex-1 flex-col items-end gap-2 md:hidden xl:flex">
            <FinancingPill
              monthly={totals.financingMonthly}
              format={formatPrice}
              className="px-2 py-[5px] text-[12px]"
            />
            <SummaryTotal
              total={totals.total}
              compareSubtotal={totals.compareSubtotal}
              showCompare={hasSavings}
              format={formatPrice}
              animated
              compareSizeClass="text-[18px]"
              totalSizeClass="text-[24px]"
            />
          </div>
        </div>

        {/* Tablet only — "as low as" pill LEFT + compare + active price RIGHT */}
        <div className="hidden md:flex xl:hidden items-center justify-between mt-[16px]">
          <FinancingPill
            monthly={totals.financingMonthly}
            format={formatPrice}
            className="p-[8px] text-[13px] lg:text-[16px]"
          />
          <SummaryTotal
            total={totals.total}
            compareSubtotal={totals.compareSubtotal}
            showCompare={hasSavings}
            format={formatPrice}
            compareSizeClass="text-[18px] lg:text-[22px]"
            totalSizeClass="text-[24px] lg:text-[28px]"
          />
        </div>
      </div>

      {/* Savings callout + checkout */}
      <div className="flex flex-col gap-[4px] pt-[10px] md:pt-[2px] xl:pt-[10px]">
        <AnimatePresence>
          {hasSavings && (
            <motion.p
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="text-center text-[11px] lg:text-[14px] xl:text-[12px] font-semibold text-chip xl:whitespace-nowrap"
            >
              Congrats! You&rsquo;re saving {formatPrice(totals.savings)} on your security bundle!
            </motion.p>
          )}
        </AnimatePresence>

        <CheckoutButton />
      </div>

      <SaveForLaterLink />
    </div>
  );
}
