import { CategoryType } from '../enums';

// --- Category ---
export interface Category {
  categoryId: number;
  name: string;
  iconUrl?: string;
  displayOrder: number;
  subCategories: SubCategory[];
}

export interface SubCategory {
  categoryId: number;
  name: string;
  iconUrl?: string;
  displayOrder: number;
}

export interface CategorySimple {
  categoryId: number;
  name: string;
  iconUrl?: string;
  displayOrder: number;
}

export interface CategoryRandomResponse {
  categoryId: number;
  name: string;
  categoryType: CategoryType;
  thumbnailUrl?: string;
  displayOrder: number;
}
