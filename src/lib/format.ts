/** A bound currency formatter: takes a number, returns a display string. */
export type Money = (value: number) => string;

// Intl.NumberFormat instances are relatively expensive to construct, so cache
// one per currency.
const formatterCache = new Map<string, Intl.NumberFormat>();

function formatterFor(currency: string): Intl.NumberFormat {
  let formatter = formatterCache.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency });
    formatterCache.set(currency, formatter);
  }
  return formatter;
}

/** Format a number as a localized currency string, e.g. 27.98 -> "$27.98". */
export function formatPrice(value: number, currency = 'USD'): string {
  return formatterFor(currency).format(value);
}
