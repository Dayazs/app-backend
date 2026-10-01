import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';

/**
 * Prisma 数据库访问封装
 *
 * 继承生成的 PrismaClient，在 Nest 生命周期里自动 connect / disconnect。
 * 使用前请先执行：pnpm exec prisma generate
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  /** 模块启动时连接数据库 */
  async onModuleInit() {
    await this.$connect();
  }

  /** 模块销毁时断开连接，避免连接泄漏 */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
