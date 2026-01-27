export interface ApiResponse<T> {
  status: string;
  timestamp: string;
  data: T;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  sort: Sort;
}

export interface Page<T> {
  content: T[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  size: number;
  sort: Sort;
  numberOfElements: number;
  empty: boolean;
}
