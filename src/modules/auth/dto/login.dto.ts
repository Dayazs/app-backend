import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * 登录请求体
 * 用户端与管理端共用同一结构（查不同表）。
 */
export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  account!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password!: string;
}
