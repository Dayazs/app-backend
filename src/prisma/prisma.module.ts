import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * 全局 Prisma 模块
 *
 * @Global() 后，其它模块无需反复 imports: [PrismaModule]，
 * 直接注入 PrismaService 即可。
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
