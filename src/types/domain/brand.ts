import { Product } from './product';

// --- Brand ---
export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoImageUrl?: string;
}

export interface BrandWithProducts {
  id: number;
  name: string;
  logoImageUrl: string;
  products: Product[];
}
