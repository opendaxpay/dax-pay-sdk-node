# DaxPay Open SDK for Node.js

DaxPay 开放支付平台 Node.js SDK（TypeScript），封装支付下单、关闭、退款、订单查询与回调验签。

> **适配 DaxPay Open ≥ 1.0** · **Node.js 18+** · LGPL-3.0 · 零运行时依赖（内置 `crypto` + `fetch`）

## 功能

- RSA 双向签名（SHA256withRSA，`crypto.sign`），自动签名请求 / 验签响应与回调
- 走 JSON 签名路径，与开源版后端 `reqTime` 契约对齐
- 核心支付接口：pay / close / refund / query pay-order / query refund-order
- 异步回调验签
- 完整 TypeScript 类型

## 安装（源码引入）

```bash
npm install github:opendaxpay/dax-pay-sdk-node
```

```ts
import { DaxPayClient, Config } from '@daxpay/open-sdk'
```

## 快速开始

```ts
const client = new DaxPayClient({
  serviceUrl: 'https://sandbox.daxpay.cn',
  mchNo: 'M200000001',
  appId: 'APP001',
  privateKey: merchantPrivateKeyPem,    // PEM 文本
  publicKey: platformPublicKeyPem,       // PEM 文本
  timeout: 30000,
})

// 支付下单
const result = await client.pay({
  bizOrderNo: 'PAY20250805001',
  title: '测试商品',
  amount: 100,            // 分
  method: 'wechat_qr',
  notifyUrl: 'https://example.com/notify',
})

// 回调验签
// const ok = client.verifyNotice(rawBody)
```

> 完整可运行示例见 [`examples/pay.ts`](examples/pay.ts)。

## 接口文档

- [接入准备](https://doc.open.daxpay.cn/api/getting-started) · [签名规则](https://doc.open.daxpay.cn/api/signature)
- 黄金测试向量：见 [`test/golden-vector.test.ts`](test/golden-vector.test.ts)（与后端签名契约同源断言）

## License

LGPL-3.0，与主仓库 [DaxPay Open](https://gitee.com/dromara/dax-pay) 同协议。
