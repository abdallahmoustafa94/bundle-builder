import { cn } from '../../lib/cn';
import { useBundle } from '../../store/bundleContext';

interface PriceProps {
  price: number;
  compareAtPrice?: number | null;
  suffix?: string | null;
  free?: boolean;
  /** Card prices strike compare in red; review prices use gray + purple. */
  variant?: 'card' | 'review';
  align?: 'left' | 'right';
}

/**
 * Compare-at price (struck through) + active price.
 * Card: compare stacked above active, right-aligned (fits narrow card widths).
 * Review: responsive row/column by breakpoint.
 */
export function Price({
  price,
  compareAtPrice,
  suffix,
  free,
  variant = 'card',
  align = 'right',
}: PriceProps) {
  const { formatPrice } = useBundle();
  const showCompare = compareAtPrice != null && compareAtPrice > price;
  const isCard = variant === 'card';
  // Card: compare red strike-through, active neutral. Review: compare gray, active purple semibold.
  const compareStyle = isCard
    ? 'text-[16px] font-normal leading-none text-compare'
    : 'text-[14px] font-medium leading-none text-gray-600';
  const activeStyle = isCard
    ? 'text-[16px] font-normal leading-none text-priceink'
    : 'text-[14px] font-semibold leading-none text-wyze-purple';

  const layout = isCard
    ? 'flex flex-col items-end gap-[3px]'
    : align === 'right'
    ? 'flex flex-col items-end gap-[3px] md:flex-row md:items-baseline md:justify-end md:gap-[6px] xl:flex-col xl:items-end xl:gap-[3px]'
    : 'flex flex-col items-start gap-[3px] md:flex-row md:items-baseline md:justify-start md:gap-[6px] xl:flex-col xl:items-start xl:gap-[3px]';

  return (
    <div className={layout}>
      {showCompare && (
        <span className={cn('whitespace-nowrap line-through', compareStyle)}>
          {formatPrice(compareAtPrice!)}
          {suffix}
        </span>
      )}
      <span className={cn('whitespace-nowrap', activeStyle)}>
        {free ? 'FREE' : `${formatPrice(price)}${suffix ?? ''}`}
      </span>
    </div>
  );
}
