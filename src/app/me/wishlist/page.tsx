import { getMyWishlist } from '@/app/actions/wishlist';
import WishlistGrid from '@/components/wishlist/wishlist-grid';
import MainHeader from '@/components/layout/main-header';
import MainNavBar from '@/components/layout/main-nav-bar';

export default async function WishlistPage() {
  const wishlistItems = await getMyWishlist();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <MainHeader />
      <main className="mx-auto w-full max-w-screen-lg flex-grow px-4 pb-20">
        <h1 className="mt-4 mb-6 text-2xl font-bold">
          찜 목록
          {wishlistItems.length > 0 && (
            <span className="ml-2 text-lg font-normal text-gray-500">
              {wishlistItems.length}개
            </span>
          )}
        </h1>
        <WishlistGrid items={wishlistItems} />
      </main>
      <MainNavBar />
    </div>
  );
}
