import type { Class } from '../types';

/** Stable Arabic locale sort for class pickers (Classes page). */
export function sortClassesByArabicName<T extends Pick<Class, 'name'>>(classes: T[]): T[] {
  return [...classes].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
}