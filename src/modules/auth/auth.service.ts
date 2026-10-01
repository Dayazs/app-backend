import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

export type AuthRole = 'user' | 'admin';

type AuthEntity = {
  id: bigint;
  account: string;
  name: string;
  avatar: string | null;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  /** App 注册 → users，注册成功直接发 token */
  async registerUser(dto: RegisterDto) {
    const exists = await this.prisma.users.findUnique({
      where: { account: dto.account },
    });
    if (exists) {
      // 冲突异常
      throw new ConflictException('账号已存在');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.users.create({
      data: {
        account: dto.account,
        name: dto.name,
        password,
      },
    });

    return this.buildAuthResponse(user, 'user');
  }

  /** App 登录 → users */
  async loginUser(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { account: dto.account },
    });
    return this.loginWithPassword(user, dto.password, 'user');
  }

  /** 管理端登录 → admins（不开放注册） */
  async loginAdmin(dto: LoginDto) {
    const admin = await this.prisma.admins.findUnique({
      where: { account: dto.account },
    });
    return this.loginWithPassword(admin, dto.password, 'admin');
  }

  private async loginWithPassword(
    entity: AuthEntity | null,
    plainPassword: string,
    role: AuthRole,
  ) {
    // 账号不存在与密码错误同一文案，避免枚举账号
    if (!entity) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const ok = await bcrypt.compare(plainPassword, entity.password);
    if (!ok) {
      throw new UnauthorizedException('账号或密码错误');
    }

    return this.buildAuthResponse(entity, role);
  }

  private buildAuthResponse(
    entity: Omit<AuthEntity, 'password'>,
    role: AuthRole,
  ) {
    const payload = {
      sub: String(entity.id), // 避免 JSON 序列化问题
      account: entity.account,
      role,
    };

    // 构建返回数据
    return {
      accessToken: this.jwt.sign(payload),
      user: {
        id: String(entity.id),
        account: entity.account,
        name: entity.name,
        avatar: entity.avatar,
        role,
      },
    };
  }
}
