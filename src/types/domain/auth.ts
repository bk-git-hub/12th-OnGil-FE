import { LoginType } from '../enums';

export interface LoginReqDto {
  loginId: string;
  password: string;
}

export interface AuthResDto {
  userId: number;
  nickName: string;
  profileUrl?: string;
  accessToken: string;
  refreshToken: string;
  loginType: LoginType;
  isNewUser: boolean;
  expires_in: number;
}

export interface TokenRefreshReqDto {
  refreshToken: string;
}

export interface TokenRefreshResDto {
  accessToken: string;
  refreshToken: string;
}
