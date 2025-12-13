// lib/utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * cn()
 * ----
 * Classname utility used by:
 * - shadcn/ui components
 * - Radix UI wrappers
 * - dropdown-menu
 * - button, card, input, etc.
 *
 * DO NOT move this function.
 * DO NOT rename this file.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
