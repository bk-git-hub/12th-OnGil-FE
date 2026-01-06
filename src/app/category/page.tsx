import { CategoryLayout, CategoryContentList } from '@/components/category';
import { CATEGORIES } from '@/mocks/category-data';

// 페이지에서 데이터(CATEGORIES)를 불러와, 레이아웃 컴포넌트 안에 리스트 컴포넌트를 Children으로 내려보냄.

export default function CategoryPage() {
  // fetch()나 다른 비동기 작업이 필요하면 여기에 추가 가능.
  const categoryIds = CATEGORIES.map((c) => c.id);

  return (
    <CategoryLayout categories={CATEGORIES}>
      <CategoryContentList categories={CATEGORIES} />
    </CategoryLayout>
  );
}
