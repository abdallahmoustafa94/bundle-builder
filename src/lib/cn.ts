import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Compose conditional class names and resolve conflicting Tailwind utilities.
 * `cn('p-2', isActive && 'bg-panel', condition ? 'a' : 'b')`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
