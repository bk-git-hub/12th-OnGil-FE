type SubCategory = {
  id: string;
  name: string;
  imageUrl: string;
};

export type Category = {
  id: string;
  name: string;
  subCategories: SubCategory[];
};

// 카테고리 목업 데이터.

const getRealImage = (keyword: string) => {
  const images: Record<string, string> = {
    top: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80',
    outer:
      'https://images.unsplash.com/photo-1551028919-ac6635f0e5c9?auto=format&fit=crop&w=300&q=80',
    pants:
      'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=300&q=80',
    skirt:
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=300&q=80',
    shoes:
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=300&q=80',
    bag: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80',
    hat: 'https://images.unsplash.com/photo-1533867617858-e7b97e0605df?auto=format&fit=crop&w=300&q=80',
    default:
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=300&q=80',
  };
  return images[keyword] || images.default;
};

export const CATEGORIES: Category[] = [
  {
    id: 'top',
    name: '상의',
    subCategories: [
      { id: 'top-all', name: '상의 전체', imageUrl: getRealImage('top') },
      { id: 'top-1', name: '니트/스웨터', imageUrl: getRealImage('top') },
      { id: 'top-2', name: '후드 티셔츠', imageUrl: getRealImage('top') },
      { id: 'top-3', name: '맨투맨/스웨트', imageUrl: getRealImage('top') },
      { id: 'top-4', name: '긴소매 티셔츠', imageUrl: getRealImage('top') },
      { id: 'top-5', name: '셔츠/블라우스', imageUrl: getRealImage('top') },
      { id: 'top-6', name: '반소매 티셔츠', imageUrl: getRealImage('top') },
    ],
  },
  {
    id: 'outer',
    name: '아우터',
    subCategories: [
      { id: 'outer-all', name: '아우터 전체', imageUrl: getRealImage('outer') },
      {
        id: 'outer-1',
        name: '겨울 싱글 코트',
        imageUrl: getRealImage('outer'),
      },
      {
        id: 'outer-2',
        name: '겨울 더블 코트',
        imageUrl: getRealImage('outer'),
      },
      {
        id: 'outer-3',
        name: '숏패딩/헤비 아우터',
        imageUrl: getRealImage('outer'),
      },
      {
        id: 'outer-4',
        name: '롱패딩/헤비 아우터',
        imageUrl: getRealImage('outer'),
      },
      { id: 'outer-6', name: '재킷', imageUrl: getRealImage('outer') },
      { id: 'outer-9', name: '카디건', imageUrl: getRealImage('outer') },
    ],
  },
  {
    id: 'pants',
    name: '바지',
    subCategories: [
      { id: 'pants-all', name: '바지 전체', imageUrl: getRealImage('pants') },
      { id: 'pants-1', name: '데님 팬츠', imageUrl: getRealImage('pants') },
      { id: 'pants-2', name: '코튼 팬츠', imageUrl: getRealImage('pants') },
      {
        id: 'pants-3',
        name: '슈트 팬츠/슬랙스',
        imageUrl: getRealImage('pants'),
      },
      {
        id: 'pants-4',
        name: '트레이닝/조거 팬츠',
        imageUrl: getRealImage('pants'),
      },
      { id: 'pants-5', name: '숏 팬츠', imageUrl: getRealImage('pants') },
    ],
  },
  {
    id: 'skirt',
    name: '스커트',
    subCategories: [
      { id: 'skirt-all', name: '스커트 전체', imageUrl: getRealImage('skirt') },
      { id: 'sk-1', name: '미니 스커트', imageUrl: getRealImage('skirt') },
      { id: 'sk-2', name: '미디 스커트', imageUrl: getRealImage('skirt') },
      { id: 'sk-3', name: '롱 스커트', imageUrl: getRealImage('skirt') },
    ],
  },
  {
    id: 'shoes',
    name: '신발',
    subCategories: [
      { id: 'shoes-all', name: '신발 전체', imageUrl: getRealImage('shoes') },
      { id: 'shoes-1', name: '스니커즈', imageUrl: getRealImage('shoes') },
      { id: 'shoes-2', name: '구두', imageUrl: getRealImage('shoes') },
      { id: 'shoes-5', name: '부츠/워커', imageUrl: getRealImage('shoes') },
    ],
  },
  {
    id: 'bag',
    name: '가방',
    subCategories: [
      { id: 'bag-all', name: '가방 전체', imageUrl: getRealImage('bag') },
      { id: 'bag-1', name: '백팩', imageUrl: getRealImage('bag') },
      { id: 'bag-3', name: '숄더/토트 백', imageUrl: getRealImage('bag') },
    ],
  },
  {
    id: 'hat',
    name: '모자',
    subCategories: [
      { id: 'hat-all', name: '모자 전체', imageUrl: getRealImage('hat') },
      { id: 'hat-1', name: '캡/야구 모자', imageUrl: getRealImage('hat') },
      { id: 'hat-3', name: '비니', imageUrl: getRealImage('hat') },
    ],
  },
];
