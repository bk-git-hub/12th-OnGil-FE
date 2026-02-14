'use client';

import { useTransition, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  useForm,
  Control,
  Controller,
  Path,
  FieldValues,
  FieldError,
  Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { UserBodyInfo } from '@/types/domain/size';
import { bodyInfoSchema, BodyInfoSchemaType } from '@/schemas/body-info';
import {
  updateBodyInfoAction,
  getSizeOptionsAction,
  getMyBodyInfoAction,
  getBodyInfoTermsAction, // 약관 조회 액션
  TermsData, // 약관 데이터 타입
} from '@/app/actions/body-info';

// 사이즈 정보 입력/수정 폼 컴포넌트

interface SizeOptionsState {
  topSizes: string[];
  bottomSizes: string[];
  shoeSizes: string[];
}

// 스타일 상수 정의
const STYLES = {
  label: 'text-2xl leading-5',
  baseBox:
    'mt-[31px] flex items-center w-full h-18 rounded-lg px-3 bg-[#D9D9D98C] text-base transition-colors',
  normalBorder:
    'border border-gray-300 focus-within:border-ongil-teal focus-within:ring-1 focus-within:ring-ongil-teal data-[state=open]:border-ongil-teal data-[state=open]:ring-1 data-[state=open]:ring-ongil-teal',
  errorBorder: 'border border-red-500 focus-within:ring-red-500 text-red-500',
};

// 아이콘 스타일 -> ShadCn select 컴포넌트의 화살표 아이콘에 적용
const ICON_STYLE = cn(
  '[&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-gray-100 [&_svg]:opacity-100',
  '[&_svg]:transition-transform [&_svg]:duration-200',
  'data-[state=open]:[&_svg]:rotate-180 data-[state=open]:[&_svg]:text-black',
);

interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  unit: string;
  error?: FieldError;
  placeholder?: string;
}

// input 필드 컴포넌트(키, 몸무게)
const InputField = <T extends FieldValues>({
  label,
  name,
  control,
  unit,
  error,
  placeholder = '0',
}: InputFieldProps<T>) => (
  <div className="space-y-2">
    <label className={STYLES.label}>{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={cn(
            STYLES.baseBox,
            error ? STYLES.errorBorder : STYLES.normalBorder,
          )}
        >
          <input
            type="number"
            inputMode="numeric"
            step="1"
            placeholder={placeholder}
            value={field.value ?? ''}
            onChange={(event) => field.onChange(event.target.value)}
            className="w-full bg-transparent text-right text-base outline-none placeholder:text-gray-400"
          />
          <span className="ml-2 text-base whitespace-nowrap text-gray-700">
            {unit}
          </span>
        </div>
      )}
    />
    {error && <p className="text-xs text-red-500">{error.message}</p>}
  </div>
);

interface SelectFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  control: Control<T>;
  options: string[];
  error?: FieldError;
  placeholder?: string;
}

// 선택 필드 컴포넌트(상의, 하의, 신발 사이즈)
const SelectField = <T extends FieldValues>({
  label,
  name,
  control,
  options,
  error,
  placeholder = '선택해주세요',
}: SelectFieldProps<T>) => (
  <div className="space-y-2">
    <label className={STYLES.label}>{label}</label>
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select onValueChange={field.onChange} value={field.value?.toString()}>
          <SelectTrigger
            className={cn(
              STYLES.baseBox,
              'justify-between outline-none focus:ring-0',
              error ? STYLES.errorBorder : STYLES.normalBorder,
              ICON_STYLE,
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent
            position="popper"
            className="w-full min-w-(--radix-select-trigger-width)"
            sideOffset={0}
          >
            {options.map((opt) => (
              <SelectItem
                key={opt}
                value={opt}
                className="cursor-pointer py-3 text-base focus:bg-gray-100"
              >
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
    {error && <p className="text-xs text-red-500">{error.message}</p>}
  </div>
);

interface BodyInfoFormProps {
  initialData: UserBodyInfo | null;
  onSuccess?: () => void;
}

// 체형 정보 입력/수정 폼 컴포넌트, 위에서 만든 컴포넌트를 조립.
export function BodyInfoForm({ initialData, onSuccess }: BodyInfoFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // 옵션 목록 & 로딩 상태
  const [sizeOptions, setSizeOptions] = useState<SizeOptionsState | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // 약관 모달 상태 및 데이터
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isTermsLoading, setIsTermsLoading] = useState(false);

  // 약관 조회 핸들러
  const handleViewTerms = async () => {
    setIsTermsOpen(true);
    if (!terms) {
      setIsTermsLoading(true);
      const result = await getBodyInfoTermsAction();
      if (result.success && result.data) {
        setTerms(result.data);
      } else {
        console.error(result.message);
      }
      setIsTermsLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BodyInfoSchemaType>({
    resolver: zodResolver(bodyInfoSchema) as Resolver<BodyInfoSchemaType>,
    defaultValues: initialData || {
      height: 0,
      weight: 0,
      usualTopSize: '',
      usualBottomSize: '',
      usualShoeSize: '',
    },
  });

  // 데이터 초기화
  useEffect(() => {
    const initData = async () => {
      try {
        const [optionsResult, myInfoResult] = await Promise.all([
          getSizeOptionsAction(),
          getMyBodyInfoAction(),
        ]);

        if (optionsResult.success && optionsResult.data) {
          setSizeOptions(optionsResult.data);
        }

        if (
          myInfoResult.success &&
          myInfoResult.data &&
          myInfoResult.data.hasBodyInfo
        ) {
          reset(myInfoResult.data);
        }
      } catch (e) {
        console.error('Failed to initialize form', e);
      } finally {
        setIsInitializing(false);
      }
    };

    initData();
  }, [reset]);

  const onSubmit = (data: BodyInfoSchemaType) => {
    startTransition(async () => {
      try {
        const result = await updateBodyInfoAction(data, pathname);

        if (!result.success) {
          alert(result.message);
          return;
        }
        router.refresh();
        onSuccess?.();
      } catch (error) {
        console.error('Submit Error:', error);
        alert('저장 중 오류가 발생했습니다.');
      }
    });
  };

  if (isInitializing || !sizeOptions) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full flex-col justify-between bg-white"
      >
        <div className="scrollbar-hide flex-1 overflow-y-auto px-[55px] pb-10">
          {/* 키 / 몸무게 섹션 */}
          <div className="flex flex-col gap-[74px]">
            <InputField
              label="키"
              name="height"
              unit="cm"
              control={control}
              error={errors.height}
            />
            <InputField
              label="몸무게"
              name="weight"
              unit="kg"
              control={control}
              error={errors.weight}
            />
          </div>

          {/* 신발 사이즈 섹션 */}
          <div className="mt-[74px]">
            <SelectField
              label="신발 사이즈"
              name="usualShoeSize"
              options={sizeOptions.shoeSizes}
              control={control}
              error={errors.usualShoeSize}
            />
          </div>

          {/* 상의 / 하의 섹션 */}
          <div className="mt-[74px] flex flex-col gap-[74px]">
            <SelectField
              label="상의"
              name="usualTopSize"
              options={sizeOptions.topSizes}
              control={control}
              error={errors.usualTopSize}
            />
            <SelectField
              label="하의"
              name="usualBottomSize"
              options={sizeOptions.bottomSizes}
              control={control}
              error={errors.usualBottomSize}
            />
          </div>
        </div>

        {/* --- 하단 영역 --- */}
        <div className="border-ongil-teal flex w-full flex-col gap-5 border-t bg-white p-6">
          <div className="flex gap-4">
            <div className="mr-7 flex flex-col justify-between rounded-lg px-4 py-3 text-start text-xl tracking-[0.08px] text-black">
              <span>내 사이즈</span>
              <span>사이즈 정보 수집 이용</span>
            </div>

            <div className="ml-2 flex items-center justify-center">
              <button
                type="button"
                onClick={handleViewTerms}
                className="bg-ongil-teal h-[49px] w-[94px] rounded-3xl transition-opacity hover:opacity-90"
              >
                <span className="font-semibold text-white">보러가기</span>
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-ongil-teal disabled:bg-ongil-teal/50 h-14 w-full rounded-xl text-lg font-bold hover:bg-[#00252a]"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                저장 중...
              </>
            ) : (
              '변경하기'
            )}
          </Button>
        </div>
      </form>
      {/* 약관 모달 Dialog MVP에 없어서 프로토타입으로 잡아둠, */}
      <Dialog open={isTermsOpen} onOpenChange={setIsTermsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {terms ? terms.title : '약관을 불러오는 중입니다'}
            </DialogTitle>
            {terms && (
              <DialogDescription>
                시행일: {terms.effectiveDate} (v{terms.version})
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="mt-4 text-sm leading-relaxed whitespace-pre-wrap text-gray-700">
            {isTermsLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : (
              terms?.content
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
