import NodeRSA from "node-rsa";

const rsaKey = new NodeRSA({ b: 512 });
rsaKey.setOptions({ encryptionScheme: 'pkcs1' });

export const pubKey = rsaKey.exportKey('pkcs8-public-pem');
export const priKey = rsaKey.exportKey('pkcs8-private-pem');

export function rsaDecrypt(buff: string) {
  rsaKey.importKey(priKey);
  return rsaKey.decrypt(buff, 'utf8');
}