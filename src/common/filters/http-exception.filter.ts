import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ApiResponse } from '../types/api-response';

/**
 * 全局异常过滤器（Fastify）
 * 失败统一返回：{ code, message, data, timestamp, errors? }
 * code 对齐 HTTP status
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();

    // 默认错误
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let errors: unknown = null;

    // 判断是否为 NestJS 的 HttpException
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object') {
        const obj = body as Record<string, unknown>;
        // ValidationPipe 默认：{ message: string[] | string, error, statusCode }
        const raw = obj.message;

        /** 因为 pipe 总是返回数组类型错误
         * [
         * "email must be an email",
         * "password must be longer than or equal to 6 characters"
         * ]
         * 所以统一错误格式
         * */
        if (Array.isArray(raw)) {
          message = '参数校验失败';
          errors = raw;
        } else if (typeof raw === 'string') {
          message = raw;
        } else if (typeof obj.error === 'string') {
          message = obj.error;
        }
      }
    } else if (exception instanceof Error) {
      // 生产环境应打日志；不要把 stack 返回给客户端
      message = '服务器内部错误';
    }

    const payload: ApiResponse = {
      code: status,
      message,
      data: null,
      timestamp: Date.now(),
      errors,
    };

    void reply.status(status).send(payload);
  }
}
