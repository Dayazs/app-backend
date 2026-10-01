/**
 * 统一接口返回数据格式
 * code: 0 成功；非 0 为业务错误码（见 ErrorCode）
 */
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
  timestamp: number;
  /** ValidationPipe 字段错误等；其他情况可为 null */
  errors?: unknown;
}
