import { Money } from '../../lib/format';
import { cn } from '../../lib/cn';

interface FinancingPillProps {
  monthly: number;
  format: Money;
  /** Per-breakpoint size/padding overrides; the base look is shared. */
  className?: string;
}

/** "as low as $X/mo" financing pill. */
export function FinancingPill({ monthly, format, className = '' }: FinancingPillProps) {
  return (
    <span
      className={cn(
        'rounded-[3px] bg-wyze-purple font-medium leading-none tracking-[-0.05em] text-white whitespace-nowrap',
        className,
      )}
    >
      as low as {format(monthly)}/mo
    </span>
  );
}
