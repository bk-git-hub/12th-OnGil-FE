// --- Wishlist ---
export interface Wishlist {
  wishlistId: number;
  productId: number;
  productName: string;
  brandName: string;
  categoryId: number;
  categoryName: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  thumbnailImageUrl: string;
}

// --- Home & Advertisement ---
export interface Home {
  bannerUrls: string[];
  recommendProducts: string[];
  latestMagazineTitle: string;
}

export interface Advertisement {
  id: number;
  imageUrl: string;
  title: string;
  description: string;
}
