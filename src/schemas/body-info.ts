import { z } from 'zod';

export const bodyInfoSchema = z.object({
  height: z.coerce
    .number()
    .min(1, { message: '키는 1cm 이상이어야 합니다' })
    .max(250, { message: '올바른 키를 입력해주세요' }),

  weight: z.coerce
    .number()
    .min(1, { message: '몸무게는 1kg 이상이어야 합니다' })
    .max(200, { message: '올바른 몸무게를 입력해주세요' }),

  usualTopSize: z.string().min(1, { message: '상의 사이즈를 선택해주세요' }),
  usualBottomSize: z.string().min(1, { message: '하의 사이즈를 선택해주세요' }),
  usualShoeSize: z.string().min(1, { message: '발 사이즈를 선택해주세요' }),
});

export type BodyInfoSchemaType = z.infer<typeof bodyInfoSchema>;
