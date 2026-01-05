export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  displayOrder: number;
  imageUrl: string | null;
  createdAt: string;
}

const categories: Category[] = [];
const now = new Date().toISOString();

// 1. 최상위 카테고리 10개 (ID: 1~10)
const rootNames = [
  '패션의류',
  '뷰티',
  '출산/유아동',
  '식품',
  '주방용품',
  '생활용품',
  '홈인테리어',
  '가전디지털',
  '스포츠/레저',
  '자동차용품',
];

rootNames.forEach((name, i) => {
  categories.push({
    id: i + 1,
    name,
    parentId: null,
    displayOrder: i + 1,
    imageUrl: `https://picsum.photos/seed/${i + 1}/200`, // 샘플 이미지
    createdAt: now,
  });
});

// 2. 최상위별 하위 카테고리 7개씩 (ID: 11~80)
let currentId = 11;
for (let rootId = 1; rootId <= 10; rootId++) {
  for (let j = 1; j <= 7; j++) {
    categories.push({
      id: currentId++,
      name: `${rootNames[rootId - 1]} 하위 ${j}`,
      parentId: rootId,
      displayOrder: j,
      imageUrl: null, // 하위는 nullable 처리
      createdAt: now,
    });
  }
}

// 3. 뎁스 2~6 사이의 랜덤 카테고리 50개 (ID: 81~130)
// 이미 생성된 11~80번(Level 2)을 부모로 삼아 무작위로 확장
for (let k = 81; k <= 130; k++) {
  const randomParentId = Math.floor(Math.random() * (currentId - 11)) + 11;
  categories.push({
    id: k,
    name: `심화 카테고리 ${k}`,
    parentId: randomParentId,
    displayOrder: 1,
    imageUrl: null,
    createdAt: now,
  });
}

export const MAIN_CATEGORIES = categories.slice(0, 15);

export const MOCK_CATEGORY_DATA = categories;
