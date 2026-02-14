'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDaumPostcodePopup } from 'react-daum-postcode';
import {
  registerAddress,
  setAsDefaultAddress,
  updateAddress,
} from '@/app/actions/address';
import { AddressItem, AddressRequest } from '@/types/domain/address';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label';

interface AddressFormProps {
  initialData?: AddressItem;
}

interface PostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  zonecode: string;
}

export default function AddressForm({ initialData }: AddressFormProps) {
  const router = useRouter();
  const openPostcode = useDaumPostcodePopup();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeliveryRequestTouched, setIsDeliveryRequestTouched] =
    useState(false);
  const [isDefaultAddress, setIsDefaultAddress] = useState(
    initialData?.isDefault ?? false,
  );

  const isEditMode = !!initialData;
  const isDefaultAddressLocked = isEditMode && initialData?.isDefault === true;

  const [formState, setFormState] = useState<AddressRequest>({
    recipientName: initialData?.recipientName || '',
    phone: initialData?.recipientPhone || '',
    postalCode: initialData?.postalCode || '',
    baseAddress: initialData?.baseAddress || '',
    detailAddress: initialData?.detailAddress || '',
    deliveryRequest: initialData?.deliveryRequest || '',
  });

  const handleChange = (field: keyof AddressRequest, val: string) => {
    setFormState((prev) => ({ ...prev, [field]: val }));
  };

  const handlePostcodeComplete = (data: PostcodeData) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') extraAddress += data.bname;
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    setFormState((prev) => ({
      ...prev,
      postalCode: data.zonecode,
      baseAddress: fullAddress,
    }));
  };

  const handleSearchPostcode = () => {
    openPostcode({ onComplete: handlePostcodeComplete });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formState.recipientName ||
      !formState.phone ||
      !formState.postalCode ||
      !formState.baseAddress ||
      !formState.detailAddress
    ) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    const phoneRegex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
    if (!phoneRegex.test(formState.phone)) {
      alert('올바른 휴대폰 번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      let targetAddressId: number | null = null;

      if (isEditMode && initialData) {
        const updatePayload: AddressRequest = { ...formState };
        if (!isDeliveryRequestTouched) {
          delete updatePayload.deliveryRequest;
        }

        await updateAddress(initialData.addressId, updatePayload);
        targetAddressId = initialData.addressId;
      } else {
        const response = await registerAddress(formState);
        targetAddressId = response.shippingDetail.addressId;
      }

      if (isDefaultAddress && targetAddressId != null) {
        await setAsDefaultAddress(targetAddressId);
      }

      alert(
        isEditMode
          ? '배송지 정보가 수정되었습니다.'
          : '배송지 정보가 등록되었습니다.',
      );
      router.back();
    } catch (error) {
      alert(error instanceof Error ? error.message : '오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-[calc(100vh-72px)] flex-col bg-white px-6 pt-7 pb-8"
    >
      <div className="space-y-8">
        <div className="grid grid-cols-[88px_1fr] items-center gap-4">
          <Label htmlFor="recipient" className="text-xl font-semibold">
            수령인
          </Label>
          <Input
            id="recipient"
            value={formState.recipientName}
            onChange={(e) => handleChange('recipientName', e.target.value)}
            placeholder="택배를 받을 분의 이름을 입력해주세요"
            className="h-16 rounded-2xl border-[#c8bebe] px-4 text-xl placeholder:text-base placeholder:text-[#b1a8a8] focus-visible:ring-0"
          />
        </div>

        <div className="grid grid-cols-[88px_1fr] items-center gap-4">
          <Label htmlFor="phone" className="text-xl font-semibold">
            휴대폰
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formState.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="휴대폰 번호를 입력해주세요"
            className="h-16 rounded-2xl border-[#c8bebe] px-4 text-xl placeholder:text-base placeholder:text-[#b1a8a8] focus-visible:ring-0"
          />
        </div>

        <div className="grid grid-cols-[88px_1fr] items-center gap-4">
          <Label htmlFor="postalCode" className="text-xl font-semibold">
            우편번호
          </Label>
          <div className="flex gap-4">
            <Input
              id="postalCode"
              value={formState.postalCode}
              readOnly
              placeholder="우편번호를 검색해주세요"
              className="h-16 w-1/2 rounded-2xl border-[#c8bebe] bg-[#fafafa] px-4 text-xl placeholder:text-[#b1a8a8] focus-visible:ring-0"
            />
            <button
              type="button"
              onClick={handleSearchPostcode}
              className="h-16 rounded-2xl border border-[#c8bebe] px-6 text-lg font-medium text-[#1d1b1b]"
            >
              주소찾기
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[88px_1fr] items-center gap-4">
          <Label htmlFor="baseAddress" className="text-xl font-semibold">
            주소
          </Label>
          <Input
            id="baseAddress"
            value={formState.baseAddress}
            readOnly
            placeholder="주소를 검색해주세요"
            className="h-16 rounded-2xl border-[#c8bebe] bg-[#fafafa] px-4 text-[20px] placeholder:text-[#b1a8a8] focus-visible:ring-0"
          />
        </div>

        <div className="grid grid-cols-[88px_1fr] items-center gap-4">
          <Label htmlFor="detailAddress" className="text-xl font-semibold">
            상세주소
          </Label>
          <Input
            id="detailAddress"
            value={formState.detailAddress}
            onChange={(e) => handleChange('detailAddress', e.target.value)}
            placeholder="상세 주소를 입력해주세요"
            className="h-16 rounded-2xl border-[#c8bebe] px-4 text-xl placeholder:text-[#b1a8a8] focus-visible:ring-0"
          />
        </div>

        <div className="grid grid-cols-[88px_1fr] items-center gap-4">
          <Label htmlFor="deliveryRequest" className="text-xl font-semibold">
            요청사항
          </Label>
          <div className="relative">
            <Input
              id="deliveryRequest"
              value={formState.deliveryRequest || ''}
              onChange={(e) => {
                setIsDeliveryRequestTouched(true);
                handleChange('deliveryRequest', e.target.value);
              }}
              placeholder="배송 요청사항을 입력해주세요"
              className="h-16 rounded-2xl border-[#c8bebe] pr-12 pl-4 text-xl placeholder:text-[#b1a8a8] focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="grid grid-cols-[88px_1fr] items-center gap-4 pt-2">
          <div className="col-start-2">
            <label
              htmlFor="isDefaultAddress"
              className="flex items-center gap-3 text-xl font-medium text-[#1d1b1b]"
            >
              <input
                id="isDefaultAddress"
                type="checkbox"
                checked={isDefaultAddress}
                onChange={(e) => setIsDefaultAddress(e.target.checked)}
                disabled={isDefaultAddressLocked}
                className="accent-ongil-teal h-6 w-6 rounded-sm border border-[#9d9494]"
              />
              기본 배송지로 선택하기
            </label>
          </div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-center px-8 pt-16">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-ongil-teal h-16 w-full rounded-3xl text-3xl font-semibold text-white disabled:bg-gray-300"
        >
          {isSubmitting ? '처리 중...' : '저장'}
        </button>
      </div>
    </form>
  );
}
