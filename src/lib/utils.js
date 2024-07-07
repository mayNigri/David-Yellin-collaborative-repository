import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

const COLOR_WHITE = '#EFEFEF'
const COLOR_YELLOW = '#FCCA46'
const COLOR_BLUE = '#03044F'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}