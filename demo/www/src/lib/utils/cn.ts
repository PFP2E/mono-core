import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines multiple class names into a single string, resolving conflicts.
 * Uses `clsx` for flexible class name definitions and `tailwind-merge` to handle Tailwind CSS class conflicts.
 * @param {...ClassValue} inputs - A list of class names. Can be strings, arrays, or objects.
 * @returns {string} The combined and merged class name string.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
