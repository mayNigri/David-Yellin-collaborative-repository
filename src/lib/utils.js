import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const COLOR_WHITE = '#EFEFEF'
export const COLOR_YELLOW = '#FCCA46'
export const COLOR_BLUE = '#03044F'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}