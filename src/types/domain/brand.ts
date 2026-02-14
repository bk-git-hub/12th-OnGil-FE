import { Product } from './product';

// --- Brand ---
export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoImageUrl?: string;
}

export interface BrandWithProducts extends Omit<Brand, 'description' | 'logoImageUrl'> {
  logoImageUrl: string;
  products: Product[];
}
