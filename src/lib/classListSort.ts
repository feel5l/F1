import type { Class } from '../types';

/** Stable Arabic locale sort for class pickers and admin tables. */
export function sortClassesByArabicName(classes: Class[]): Class[] {
  return [...classes].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}