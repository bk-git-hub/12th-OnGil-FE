'use client';

import { type ChangeEvent, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { updateProfileImageAction } from '@/app/actions/user';

interface EditProfilePhotoSheetProps {
  imageUrl: string | null;
  userName: string;
}

function withCacheBuster(url: string | null): string | null {
  if (!url) return null;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}v=${Date.now()}`;
}

export default function EditProfilePhotoSheet({
  imageUrl,
  userName,
}: EditProfilePhotoSheetProps) {
  const [open, setOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(
    withCacheBuster(imageUrl),
  );
  const [isUploading, setIsUploading] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File | null) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const updatedUser = await updateProfileImageAction(file);
      setCurrentImageUrl(withCacheBuster(updatedUser.profileUrl ?? null));
      setOpen(false);
      alert('프로필 이미지가 수정되었습니다.');
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : '프로필 이미지 수정에 실패했습니다.',
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    event.currentTarget.value = '';
    await handleUpload(selectedFile);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            aria-label="프로필 사진 수정"
            className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gray-100"
          >
            {currentImageUrl ? (
              <Image
                src={currentImageUrl}
                alt="프로필 이미지"
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src="/icons/profile.svg"
                alt="기본 프로필"
                width={56}
                height={56}
                className="h-14 w-14"
              />
            )}
          </button>
        </SheetTrigger>

        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="rounded-t-2xl border-none bg-transparent p-4 shadow-none"
        >
          <SheetTitle className="sr-only">프로필 이미지 수정</SheetTitle>
          <SheetDescription className="sr-only">
            사진 찍기 또는 보관함에서 프로필 이미지를 선택합니다.
          </SheetDescription>

          <div className="overflow-hidden rounded-2xl bg-white">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => cameraInputRef.current?.click()}
              className="w-full py-5 text-4xl font-medium text-black"
            >
              사진 찍기
            </button>
            <div className="h-px bg-[#d9d9d9]" />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => galleryInputRef.current?.click()}
              className="w-full py-5 text-4xl font-medium text-black"
            >
              사진 보관함
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={isUploading}
            className="mt-4 w-full rounded-2xl bg-white py-5 text-4xl font-semibold text-black"
          >
            취소
          </button>
        </SheetContent>
      </Sheet>

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageChange}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      <span className="text-4xl font-semibold text-black">{userName}</span>
    </div>
  );
}
