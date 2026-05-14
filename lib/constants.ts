export const CATEGORIES = ["자유", "정보", "유머"] as const;
export type Category = (typeof CATEGORIES)[number];
