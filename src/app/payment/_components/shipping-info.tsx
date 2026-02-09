import { useDaumPostcodePopup } from 'react-daum-postcode';
import { Input } from '@/components/ui/input';
import Label from '@/components/ui/label';

// 배송지 수정 페이지 구현 되면 다시 컴포넌트 UI 잡기

export interface ShippingFormState {
  recipient: string;
  recipientPhone: string;
  deliveryAddress: string;
  detailAddress: string;
  postalCode: string;
  deliveryMessage: string;
}

interface Props {
  value: ShippingFormState;
  onChange: (value: ShippingFormState) => void;
}

export default function ShippingInfoSection({ value, onChange }: Props) {
  const openPostcode = useDaumPostcodePopup();

  const handleChange = (field: keyof ShippingFormState, val: string) => {
    onChange({ ...value, [field]: val });
  };

  const handlePostcodeComplete = (data: {
    address: string;
    addressType: string;
    bname: string;
    buildingName: string;
    zonecode: string;
  }) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    onChange({
      ...value,
      postalCode: data.zonecode,
      deliveryAddress: fullAddress,
    });
  };

  const handleSearchPostcode = () => {
    openPostcode({ onComplete: handlePostcodeComplete });
  };

  return (
    <div className="p-5">
      <h2 className="mb-4 text-lg font-bold">배송지를 확인 해주세요</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="recipient" className="text-xs text-gray-500">
              받는 분
            </Label>
            <Input
              id="recipient"
              value={value.recipient}
              onChange={(e) => handleChange('recipient', e.target.value)}
              placeholder="이름"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone" className="text-xs text-gray-500">
              연락처
            </Label>
            <Input
              id="phone"
              value={value.recipientPhone}
              onChange={(e) => handleChange('recipientPhone', e.target.value)}
              placeholder="010-0000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={value.postalCode}
              readOnly
              placeholder="우편번호"
              className="w-1/3 bg-gray-50"
            />
            <button
              type="button"
              onClick={handleSearchPostcode}
              className="rounded-md bg-black px-3 py-2 text-xs text-white"
            >
              우편번호 찾기
            </button>
          </div>
          <Input
            value={value.deliveryAddress}
            readOnly
            placeholder="기본 주소"
            className="bg-gray-50"
          />
          <Input
            value={value.detailAddress}
            onChange={(e) => handleChange('detailAddress', e.target.value)}
            placeholder="상세 주소 입력"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="msg" className="text-xs text-gray-500">
            배송 요청사항
          </Label>
          <Input
            id="msg"
            value={value.deliveryMessage}
            onChange={(e) => handleChange('deliveryMessage', e.target.value)}
            placeholder="예: 문 앞에 놓아주세요."
          />
        </div>
      </div>
    </div>
  );
}
