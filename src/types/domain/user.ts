import { LoginType } from '../enums';

export interface UserInfoResDto {
  userId: number;
  name: string;
  loginType: LoginType;
  profileUrl?: string;
  phone?: string;
  points: number;

  // 신체 정보
  height?: number;
  weight?: number;
  usualTopSize?: string; // 예: M
  usualBottomSize?: string; // 예: L
  usualShoeSize?: string; // 예: 245
}

export interface UserBodyInfo {
  height: number;
  weight: number;
  usualSize: string;
}
