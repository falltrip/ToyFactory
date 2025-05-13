import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0].replace(/-/g, '.');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export const projectCategories = [
  { value: "all", label: "ALL CATEGORIES" },
  { value: "app", label: "APPLICATIONS" },
  { value: "game", label: "GAMES" },
  { value: "image", label: "IMAGES" },
  { value: "video", label: "VIDEOS" },
  { value: "etc", label: "OTHER WORKS" }
];

export const sortOptions = [
  { value: "newest", label: "NEWEST FIRST" },
  { value: "oldest", label: "OLDEST FIRST" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" }
];
