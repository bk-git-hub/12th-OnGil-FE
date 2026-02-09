export interface WishlistItem {
  wishlistId: number;
  productId: number;
  productName: string;
  brandName: string;
  price: number;
  discountRate: number;
  finalPrice: number;
  thumbnailImageUrl: string;
  categoryId: number;
  categoryName: string;
}
