/// 统一响应 DaxResult 与公共类型 — 对照 sdk-contract.md 第五节

/// 统一响应结构
export interface DaxResult<T = unknown> {
  /** 业务状态码，0 成功，非 0 失败 */
  code: number
  /** 提示信息（注意是 msg 非 message） */
  msg: string
  /** 业务数据，失败时通常 null */
  data: T | null
  /** 平台 RSA 响应签名（Base64） */
  sign?: string
  /** 响应时间 UTC ISO */
  resTime?: string
  /** 请求 ID 回显 */
  reqId?: string
}

/// 公共请求参数（所有业务请求继承，对照契约第四节）
export interface CommonParam {
  mchNo?: string
  appId?: string
  reqId?: string
  /** 请求时间（SDK 自动生成，GMT+8 yyyy-MM-dd HH:mm:ss 字面量） */
  reqTime?: string
  nonceStr?: string
  clientIp?: string
  sign?: string
}

/// 业务异常（code !== 0 时抛出）
export class DaxPayError extends Error {
  constructor(public readonly code: number, message: string) {
    super(message)
    this.name = 'DaxPayError'
  }
}

/// 常用错误码（对照契约第九节）
export const ErrorCode = {
  Success: 0,
  Fail: 1,
  AuthFail: 10401,
  NonceMissing: 10408,
  NonceInvalid: 10409,
  TimestampExpired: 10410,
  ParamParseError: 10505,
  ParamValidationError: 10506,
  TradeNotExist: 20041,
  TradeClosed: 20042,
  TradeProcessing: 20043,
  TradeStatusError: 20044,
  SignVerifyFailed: 20052,
  SystemUnknown: 30000,
} as const
