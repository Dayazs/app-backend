import { IsString, MaxLength, MinLength } from 'class-validator';

/**
 * App 用户注册请求体
 */
export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  account!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  password!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(64)
  name!: string;
}
