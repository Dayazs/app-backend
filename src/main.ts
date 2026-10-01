import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

/**
 * 应用入口
 *
 * 请求处理顺序（简化）：
 * Guard → ValidationPipe → Controller → Service
 * → TransformInterceptor（成功包装）
 * → HttpExceptionFilter（失败包装）
 */
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // 所有路由统一前缀，例如 /api/v1/app/auth/login
  app.setGlobalPrefix('api/v1');

  // DTO 校验（配合 class-validator 装饰器）
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 去掉 DTO 未声明字段
      forbidNonWhitelisted: true, // 多传未知字段直接 400
      transform: true, // 将明文 JSON 转成 DTO 类实例
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(10045, '0.0.0.0');
}

void bootstrap();
