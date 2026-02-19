'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ProductSortType } from '@/types/enums';

type FilterTab = 'size' | 'brand' | 'price';
type SheetType = 'sort' | 'filters' | null;

export interface BrandFilterOption {
  id: number;
  name: string;
}

interface ProductFilterBarProps {
  parentCategoryName: string;
  availableBrands: BrandFilterOption[];
}

interface ChipItem {
  key: 'clothingSizes' | 'priceRange' | 'brandIds';
  value: string;
  label: string;
}

const SORT_OPTIONS: { value: ProductSortType; label: string }[] = [
  { value: ProductSortType.POPULAR, label: '인기순' },
  { value: ProductSortType.REVIEW, label: '리뷰 많은순' },
  { value: ProductSortType.PRICE_LOW, label: '낮은 가격순' },
  { value: ProductSortType.PRICE_HIGH, label: '높은 가격순' },
];

const TOP_SIZE_OPTIONS = [
  { value: 'XS', label: 'XS', description: '44 이하' },
  { value: 'S', label: 'S', description: '55' },
  { value: 'M', label: 'M', description: '66' },
  { value: 'L', label: 'L', description: '77' },
  { value: 'XL', label: 'XL', description: '88 이상' },
];

const BOTTOM_SIZE_OPTIONS = [
  { value: 'XS', label: 'XS', description: '24 이하' },
  { value: 'S', label: 'S', description: '25,26' },
  { value: 'M', label: 'M', description: '27,28' },
  { value: 'L', label: 'L', description: '29,30' },
  { value: 'XL', label: 'XL', description: '31 이상' },
];

const PRICE_OPTIONS = [
  { label: '5만원 이하', value: '0-50000' },
  { label: '5-10만원', value: '50000-100000' },
  { label: '10-15만원', value: '100000-150000' },
  { label: '15-20만원', value: '150000-200000' },
  { label: '20만원 이상', value: '200000-999999999' },
];

function toggleValue(items: string[], value: string) {
  return items.includes(value)
    ? items.filter((item) => item !== value)
    : [...items, value];
}

function setRepeatedQuery(params: URLSearchParams, key: string, values: string[]) {
  params.delete(key);
  values.forEach((value) => params.append(key, value));
}

function removeOneMultiFilterValue(
  params: URLSearchParams,
  key: 'clothingSizes' | 'brandIds',
  value: string,
) {
  const nextValues = params.getAll(key).filter((item) => item !== value);
  params.delete(key);
  nextValues.forEach((item) => params.append(key, item));
}

function normalizeNumberInput(value: string) {
  return value.replace(/[^\d]/g, '');
}

function isValidPriceRange(value: string) {
  return /^\d+-\d+$/.test(value);
}

function getPriceRangeLabel(value: string) {
  return PRICE_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function getBrandLabelById(
  id: string,
  options: BrandFilterOption[],
  selectedFallback: string[],
) {
  const found = options.find((option) => String(option.id) === id);
  if (found) return found.name;
  const fallback = selectedFallback.find((optionId) => optionId === id);
  return fallback ? `브랜드 ${fallback}` : `브랜드 ${id}`;
}

export function ProductFilterBar({
  parentCategoryName,
  availableBrands,
}: ProductFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sortType') || ProductSortType.POPULAR;
  const selectedSizes = searchParams.getAll('clothingSizes');
  const selectedPriceRange = searchParams.get('priceRange') ?? '';
  const selectedBrandIds = searchParams.getAll('brandIds');

  const [openSheet, setOpenSheet] = useState<SheetType>(null);
  const [activeFilterTab, setActiveFilterTab] = useState<FilterTab>('size');
  const [tempSizes, setTempSizes] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState('');
  const [tempBrandIds, setTempBrandIds] = useState<string[]>([]);
  const [brandKeyword, setBrandKeyword] = useState('');
  const [customMinPrice, setCustomMinPrice] = useState('');
  const [customMaxPrice, setCustomMaxPrice] = useState('');

  const sizeOptions = useMemo(() => {
    if (['팬츠', '스커트'].includes(parentCategoryName)) {
      return BOTTOM_SIZE_OPTIONS;
    }
    return TOP_SIZE_OPTIONS;
  }, [parentCategoryName]);

  const mergedBrandOptions = useMemo(() => {
    const selectedOptionBackfills = selectedBrandIds
      .map((id) => {
        const found = availableBrands.find((option) => String(option.id) === id);
        return found ?? { id: Number(id), name: `브랜드 ${id}` };
      })
      .filter((option) => Number.isFinite(option.id));

    const merged = [...availableBrands, ...selectedOptionBackfills];
    const uniqueById = Array.from(
      new Map(merged.map((item) => [String(item.id), item])).values(),
    );
    return uniqueById.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  }, [availableBrands, selectedBrandIds]);

  const filteredBrands = useMemo(() => {
    const keyword = brandKeyword.trim().toLowerCase();
    if (!keyword) return mergedBrandOptions;
    return mergedBrandOptions.filter((brand) =>
      brand.name.toLowerCase().includes(keyword),
    );
  }, [mergedBrandOptions, brandKeyword]);

  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.value === currentSort)?.label || '인기순';

  const appliedChips: ChipItem[] = [
    ...selectedSizes.map((value) => ({
      key: 'clothingSizes' as const,
      value,
      label: value,
    })),
    ...(selectedPriceRange
      ? [
          {
            key: 'priceRange' as const,
            value: selectedPriceRange,
            label: getPriceRangeLabel(selectedPriceRange),
          },
        ]
      : []),
    ...selectedBrandIds.map((value) => ({
      key: 'brandIds' as const,
      value,
      label: getBrandLabelById(value, mergedBrandOptions, selectedBrandIds),
    })),
  ];

  const tempChips = [
    ...tempSizes.map((value) => ({
      key: 'clothingSizes' as const,
      value,
      label: value,
    })),
    ...(tempPriceRange
      ? [
          {
            key: 'priceRange' as const,
            value: tempPriceRange,
            label: getPriceRangeLabel(tempPriceRange),
          },
        ]
      : []),
    ...tempBrandIds.map((value) => ({
      key: 'brandIds' as const,
      value,
      label: getBrandLabelById(value, mergedBrandOptions, tempBrandIds),
    })),
  ];

  const navigateWithParams = (params: URLSearchParams) => {
    params.set('page', '0');
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const openFilterSheet = (tab: FilterTab) => {
    setTempSizes([...selectedSizes]);
    setTempPriceRange(selectedPriceRange);
    setTempBrandIds([...selectedBrandIds]);
    if (isValidPriceRange(selectedPriceRange)) {
      const [min, max] = selectedPriceRange.split('-');
      setCustomMinPrice(min);
      setCustomMaxPrice(max);
    } else {
      setCustomMinPrice('');
      setCustomMaxPrice('');
    }
    setBrandKeyword('');
    setActiveFilterTab(tab);
    setOpenSheet('filters');
  };

  const handleSortChange = (sortType: ProductSortType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sortType', sortType);
    navigateWithParams(params);
    setOpenSheet(null);
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    setRepeatedQuery(params, 'clothingSizes', tempSizes);
    setRepeatedQuery(params, 'brandIds', tempBrandIds);
    params.delete('priceRange');
    if (tempPriceRange) {
      params.set('priceRange', tempPriceRange);
    }
    navigateWithParams(params);
    setOpenSheet(null);
  };

  const handleRemoveChip = (chip: ChipItem) => {
    const params = new URLSearchParams(searchParams.toString());
    if (chip.key === 'priceRange') {
      params.delete('priceRange');
      navigateWithParams(params);
      return;
    }
    removeOneMultiFilterValue(params, chip.key, chip.value);
    navigateWithParams(params);
  };

  const renderFilterContent = () => {
    if (activeFilterTab === 'size') {
      return (
        <div className="grid grid-cols-3 gap-3">
          {sizeOptions.map((option) => {
            const isSelected = tempSizes.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTempSizes((prev) => toggleValue(prev, option.value))}
                className={`rounded-xl border px-4 py-3 text-center text-base font-semibold transition-colors ${
                  isSelected
                    ? 'border-ongil-teal bg-ongil-mint text-black'
                    : 'border-gray-300 bg-white text-gray-900'
                }`}
                title={option.description}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      );
    }

    if (activeFilterTab === 'price') {
      const canApplyCustomPrice =
        customMinPrice.length > 0 &&
        customMaxPrice.length > 0 &&
        Number(customMinPrice) <= Number(customMaxPrice);

      return (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {PRICE_OPTIONS.map((option) => {
              const isSelected = tempPriceRange === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setTempPriceRange((prev) =>
                      prev === option.value ? '' : option.value,
                    )
                  }
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'border-ongil-teal bg-ongil-mint text-black'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <div className="rounded-xl border border-gray-200 p-3">
            <p className="mb-2 text-sm font-semibold text-gray-800">직접 입력</p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <input
                value={customMinPrice}
                onChange={(event) =>
                  setCustomMinPrice(normalizeNumberInput(event.target.value))
                }
                inputMode="numeric"
                placeholder="최소 금액"
                className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none"
              />
              <span className="text-sm text-gray-500">-</span>
              <input
                value={customMaxPrice}
                onChange={(event) =>
                  setCustomMaxPrice(normalizeNumberInput(event.target.value))
                }
                inputMode="numeric"
                placeholder="최대 금액"
                className="h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none"
              />
            </div>
            <button
              type="button"
              disabled={!canApplyCustomPrice}
              onClick={() => setTempPriceRange(`${customMinPrice}-${customMaxPrice}`)}
              className="bg-ongil-teal mt-3 h-9 rounded-lg px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              직접입력 적용
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex h-12 items-center rounded-full border border-ongil-teal px-4">
          <svg
            className="mr-2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
            />
          </svg>
          <input
            value={brandKeyword}
            onChange={(event) => setBrandKeyword(event.target.value)}
            className="h-full w-full bg-transparent text-sm outline-none"
            placeholder="원하는 브랜드를 검색해요"
          />
        </div>

        <div className="h-[260px] overflow-y-auto pr-1">
          {filteredBrands.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">
              검색 결과가 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredBrands.map((brand) => {
                const brandId = String(brand.id);
                const isSelected = tempBrandIds.includes(brandId);
                return (
                  <button
                    key={brand.id}
                    type="button"
                    onClick={() =>
                      setTempBrandIds((prev) => toggleValue(prev, brandId))
                    }
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-[4px] border ${
                        isSelected
                          ? 'border-ongil-teal bg-ongil-teal text-white'
                          : 'border-ongil-teal bg-white text-transparent'
                      }`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-base font-medium text-black">{brand.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mb-3 overflow-x-auto pb-1">
        <div className="flex w-max items-center gap-2">
          <button
            type="button"
            onClick={() => setOpenSheet('sort')}
            className="border-ongil-teal text-ongil-teal flex h-10 items-center gap-1 rounded-full border bg-white px-4 text-base font-semibold"
          >
            {currentSortLabel}
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => openFilterSheet('size')}
            className="border-ongil-teal text-ongil-teal h-10 rounded-full border bg-white px-4 text-base font-semibold"
          >
            사이즈{selectedSizes.length > 0 ? selectedSizes.length : ''}
          </button>

          <button
            type="button"
            onClick={() => openFilterSheet('brand')}
            className="border-ongil-teal text-ongil-teal h-10 rounded-full border bg-white px-4 text-base font-semibold"
          >
            브랜드{selectedBrandIds.length > 0 ? selectedBrandIds.length : ''}
          </button>

          <button
            type="button"
            onClick={() => openFilterSheet('price')}
            className="border-ongil-teal text-ongil-teal h-10 rounded-full border bg-white px-4 text-base font-semibold"
          >
            가격{selectedPriceRange ? '1' : ''}
          </button>
        </div>
      </div>

      {appliedChips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {appliedChips.map((chip) => (
            <button
              key={`${chip.key}-${chip.value}`}
              type="button"
              onClick={() => handleRemoveChip(chip)}
              className="border-ongil-teal bg-ongil-mint/50 text-ongil-teal inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm font-medium"
            >
              {chip.label}
              <span className="text-xs">x</span>
            </button>
          ))}
        </div>
      )}

      {openSheet === 'sort' && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/10"
            onClick={() => setOpenSheet(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-[22px] bg-white px-6 pt-6 pb-10 shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
            <div className="mx-auto w-full max-w-7xl">
              <div className="relative mb-8 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-black">정렬</h3>
                <button
                  type="button"
                  onClick={() => setOpenSheet(null)}
                  className="absolute right-0 flex h-10 w-10 items-center justify-center rounded-full border border-[#707070] text-[#707070]"
                  aria-label="정렬 시트 닫기"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {SORT_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className="flex w-full items-center gap-4 text-left"
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border-2 ${
                        currentSort === option.value
                          ? 'border-ongil-teal bg-ongil-teal text-white'
                          : 'border-ongil-teal bg-transparent text-transparent'
                      }`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="text-2xl font-bold text-black">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {openSheet === 'filters' && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/10"
            onClick={() => setOpenSheet(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-[22px] bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.08)]">
            <div className="mx-auto w-full max-w-7xl">
              <div className="relative flex items-center justify-end px-4 pt-4 pb-2">
                <button
                  type="button"
                  onClick={() => setOpenSheet(null)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#707070] text-[#707070]"
                  aria-label="필터 시트 닫기"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-3 border-y border-gray-200 bg-[#f3f3f3]">
                {(
                  [
                    ['size', '사이즈'],
                    ['brand', '브랜드'],
                    ['price', '가격'],
                  ] as const
                ).map(([tab, label]) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveFilterTab(tab)}
                    className={`h-20 border-r border-gray-200 text-xl font-semibold last:border-r-0 ${
                      activeFilterTab === tab
                        ? 'bg-white text-black'
                        : 'bg-[#f3f3f3] text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="min-h-[290px] px-4 pt-4 pb-5">{renderFilterContent()}</div>

              <div className="border-t border-gray-200 px-4 pt-3 pb-4">
                <div className="mb-3 flex min-h-11 flex-wrap gap-2">
                  {tempChips.map((chip) => (
                    <button
                      key={`temp-${chip.key}-${chip.value}`}
                      type="button"
                      onClick={() => {
                        if (chip.key === 'clothingSizes') {
                          setTempSizes((prev) => prev.filter((item) => item !== chip.value));
                          return;
                        }
                        if (chip.key === 'priceRange') {
                          setTempPriceRange('');
                          setCustomMinPrice('');
                          setCustomMaxPrice('');
                          return;
                        }
                        setTempBrandIds((prev) =>
                          prev.filter((item) => item !== chip.value),
                        );
                      }}
                      className="border-ongil-teal bg-ongil-mint/50 text-ongil-teal inline-flex items-center gap-2 rounded-xl border px-3 py-1 text-sm font-medium"
                    >
                      {chip.label}
                      <span className="text-xs">x</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-[1fr_2fr] gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTempSizes([]);
                      setTempPriceRange('');
                      setCustomMinPrice('');
                      setCustomMaxPrice('');
                      setTempBrandIds([]);
                    }}
                    className="h-12 rounded-xl bg-[#e5e5e5] text-lg font-bold text-black"
                  >
                    초기화
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyFilters}
                    className="bg-ongil-teal h-12 rounded-xl text-lg font-bold text-white"
                  >
                    상품 보기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
