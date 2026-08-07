/// 支付下单业务模型 — 对照 sdk-contract.md 第 6.1 节
import type { CommonParam } from './types'

/// 终端信息（线下场景）
export interface TerminalInfo {
  terminalNo?: string
  storeNo?: string
  operatorId?: string
  deviceName?: string
  deviceIp?: string
  longitude?: number
  latitude?: number
}

/// 商品明细
export interface GoodsDetail {
  goodsId: string
  goodsName: string
  quantity: number
  unitPrice: number // 分
  category?: string
  description?: string
  showUrl?: string
}

/// 支付下单请求参数
export interface PayParam extends CommonParam {
  /** 商户订单号（必填） */
  bizOrderNo: string
  /** 支付标题（必填） */
  title: string
  description?: string
  /** 支付金额，分（必填） */
  amount: number
  /** 币种 ISO 4217，缺省 cny */
  currency?: string
  /** 支付产品编码（空则路由自动选择） */
  product?: string
  /** 支付方式编码 */
  method?: string
  capability?: string
  openId?: string
  channelAppId?: string
  authCode?: string
  /** 限制支付类型，如 ["no_credit"] */
  limitPay?: string[]
  /** 支付扩展参数（JSON 字符串） */
  extraParam?: string
  goodsDetail?: GoodsDetail[]
  /** 异步通知地址 */
  notifyUrl?: string
  /** 同步跳转地址 */
  returnUrl?: string
  /** 商户扩展参数，回调原样返回 */
  attach?: string
  /** 过期时间（GMT+8 yyyy-MM-dd HH:mm:ss，空默认 30 分钟） */
  expiredTime?: string
  terminal?: TerminalInfo
}

/// 支付下单响应结果
export interface PayResult {
  orderId?: number
  /** 商户订单号 */
  bizOrderNo?: string
  /** 平台业务单号 */
  orderNo?: string
  /** 资金交易号 */
  tradeNo?: string
  /** 支付状态：wait/progress/success/close/cancel/fail/timeout */
  status?: string
  /** 支付参数体（二维码链接/调起参数/跳转 URL） */
  payBody?: string
  /** 支付参数体类型：code_url/pay_info/redirect_url */
  payBodyType?: string
}
