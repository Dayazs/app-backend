import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';

/**
 * 根模块：组装全局配置、数据库、业务模块
 */
@Module({
  imports: [
    // 全局可读 ConfigService；优先 .env.development，其次 .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env'],
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
