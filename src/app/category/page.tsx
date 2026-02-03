import CategoryLayout from '@/components/category/category-layout';
import CategoryContentList from '@/components/category/category-content-list';
import { api } from '@/lib/api-client';
import { Category } from '@/types/domain/category';

// 페이지에서 데이터(CATEGORIES)를 불러와, 레이아웃 컴포넌트 안에 리스트 컴포넌트를 Children으로 내려보냄.

export default async function CategoryPage() {
  // fetch()나 다른 비동기 작업이 필요하면 여기에 추가 가능.
  const data = await api.get<Category[]>('/categories');

  return (
    <CategoryLayout categories={data}>
      <CategoryContentList categories={data} />
    </CategoryLayout>
  );
}
