import crypto from 'node:crypto'

// 商户私钥 PEM（PKCS#8，-----BEGIN PRIVATE KEY-----）→ KeyObject
function loadPrivateKey(pem: string): crypto.KeyObject {
  return crypto.createPrivateKey({ key: pem, format: 'pem', type: 'pkcs8' })
}

// 平台公钥 PEM（X.509，-----BEGIN PUBLIC KEY-----）→ KeyObject
function loadPublicKey(pem: string): crypto.KeyObject {
  return crypto.createPublicKey({ key: pem, format: 'pem', type: 'spki' })
}

/// RSA 签名（SHA256withRSA，UTF-8，Base64 输出）— 对照后端 RsaSignUtil#sign
export function rsaSign(data: string, privateKeyPem: string): string {
  const signer = crypto.createSign('SHA256')
  signer.update(data, 'utf8')
  return signer.sign(loadPrivateKey(privateKeyPem), 'base64')
}

/// RSA 验签（SHA256withRSA）— 对照后端 RsaSignUtil#verify
export function rsaVerify(data: string, signB64: string, publicKeyPem: string): boolean {
  const verifier = crypto.createVerify('SHA256')
  verifier.update(data, 'utf8')
  return verifier.verify(loadPublicKey(publicKeyPem), signB64, 'base64')
}
