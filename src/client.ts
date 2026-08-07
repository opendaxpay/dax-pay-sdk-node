import crypto from 'node:crypto'
import { type Config } from './config'
import { type DaxResult, type CommonParam, DaxPayError, ErrorCode } from './types'
import { type PayParam, type PayResult } from './models'
import { buildSignStr } from './sign'
import { rsaSign, rsaVerify } from './rsa'

const DEFAULT_TIMEOUT = 30000

// 当前时间的 GMT+8 字面量（yyyy-MM-dd HH:mm:ss）— 对照后端 @JsonFormat(GMT+8)
function nowGmt8(): string {
  const beijing = new Date(Date.now() + 8 * 3600 * 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())} ` +
    `${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}:${pad(beijing.getUTCSeconds())}`
  )
}

/// DaxPay SDK 客户端 — 对照 sdk-contract.md 第十节
export class DaxPayClient {
  private readonly serviceUrl: string
  private readonly timeout: number

  constructor(private readonly config: Config) {
    this.serviceUrl = config.serviceUrl.replace(/\/+$/, '')
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT
  }

  /// 通用执行入口：自动填充公共参数 → JSON 签名 → POST → 验签 → 返回 DaxResult<T>
  /// 走 JSON 签名路径（reqTime 已序列化为 GMT+8 字面量），与后端验签一致
  async execute<T = unknown>(path: string, param: object): Promise<DaxResult<T>> {
    const requestParam: Record<string, unknown> = { ...(param as Record<string, unknown>) }
    // 注入公共字段
    if (!requestParam.mchNo) requestParam.mchNo = this.config.mchNo
    if (!requestParam.appId && this.config.appId) requestParam.appId = this.config.appId
    if (!requestParam.reqId) requestParam.reqId = crypto.randomUUID()
    if (!requestParam.reqTime) requestParam.reqTime = nowGmt8()
    if (!requestParam.nonceStr) requestParam.nonceStr = crypto.randomBytes(16).toString('hex')

    // 走 JSON 签名路径：序列化 → 对 JSON 签名 → 注入 sign → 重新序列化发送
    const jsonForSign = JSON.stringify(requestParam)
    const signStr = buildSignStr(jsonForSign)
    requestParam.sign = rsaSign(signStr, this.config.privateKey)
    const body = JSON.stringify(requestParam)

    const url = this.serviceUrl + path
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body,
      signal: AbortSignal.timeout(this.timeout),
    })
    const rawBody = await res.text()
    if (!res.ok) {
      throw new DaxPayError(-1, `HTTP ${res.status}: ${rawBody}`)
    }

    const result = JSON.parse(rawBody) as DaxResult<T>
    // 用原始 body 字符串验签（不可先反序列化再签名，会丢精度/格式）
    if (result.sign) {
      const verifyStr = buildSignStr(rawBody)
      if (!rsaVerify(verifyStr, result.sign, this.config.publicKey)) {
        throw new DaxPayError(ErrorCode.SignVerifyFailed, '响应验签失败')
      }
    }
    if (result.code !== 0) {
      throw new DaxPayError(result.code, result.msg)
    }
    return result
  }

  /// 支付下单便捷方法 — POST /unipay/pay
  async pay(param: PayParam): Promise<DaxResult<PayResult>> {
    return this.execute<PayResult>('/unipay/pay', param)
  }

  /// 回调验签（原始 HTTP body 字符串）— 对照契约第八节
  verifyNotice(rawBody: string): boolean {
    let obj: { sign?: string }
    try {
      obj = JSON.parse(rawBody)
    } catch {
      return false
    }
    if (!obj.sign) return false
    const signStr = buildSignStr(rawBody)
    return rsaVerify(signStr, obj.sign, this.config.publicKey)
  }
}
