/// DaxPay Open SDK for Node.js — 公共入口
export type { Config } from './config.js'
export { DaxPayClient } from './client.js'
export { DaxPayError, ErrorCode } from './types.js'
export type { DaxResult, CommonParam, DaxPayObserver } from './types.js'
export { buildSignStr } from './sign.js'
export { rsaSign, rsaVerify } from './rsa.js'
export type {
  // 共享嵌套类型
  AllocDetail,
  AllocReceiver,
  GoodsDetail,
  ReportInfo,
  TerminalInfo,
  // 支付族
  CloseParam,
  PayOrderResult,
  PayParam,
  PayQueryParam,
  PayResult,
  PaySyncParam,
  PaySyncResult,
  // 退款族
  RefundOrderResult,
  RefundParam,
  RefundQueryParam,
  RefundResult,
  RefundSyncParam,
  RefundSyncResult,
  // 转账族
  TransferOrderResult,
  TransferParam,
  TransferQueryParam,
  TransferResult,
  TransferSyncParam,
  TransferSyncResult,
  // 分账族
  AllocOrderResult,
  AllocParam,
  AllocQueryParam,
  AllocResult,
  AllocSyncParam,
  AllocSyncResult,
  // 网关族
  GatewayOrderQueryParam,
  GatewayOrderResult,
  GatewayPrePayParam,
  GatewayPrePayResult,
} from './models.js'
