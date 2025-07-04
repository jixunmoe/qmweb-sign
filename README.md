# `@jixun/qmweb-sign`

QQ 音乐 (y.qq.com) 请求签名算法，`zzc` 版本，以及 `ag-1` 加密算法实现。

## 安装

```bash
pnpm i @jixun/qmweb-sign
```

## 使用

```js
// ModuleJS, bundler, etc
import { zzcSign, decodeAG1Response, encodeAG1Request } from '@jixun/qmweb-sign';

// CommonJS
const { zzcSign, decodeAG1Response, encodeAG1Request } = require('@jixun/qmweb-sign');


// 示例代码，根据需要改写。
async function example() {
  const payload = JSON.stringify({ /* 填写你的请求载荷 */ });
  const body = await encodeAG1Request(payload);
  const sign = zzcSign(payload);

  const url = `https://u6.y.qq.com/cgi-bin/musics.fcg?_=${Date.now()}&encoding=ag-1&sign=${sign}`;

  const res = await fetch(url, {
    body,
    method: 'POST',
    headers: { /* 填写你的请求头 */ },
  });
  const buffer = await res.arrayBuffer();
  const respText = decodeAG1Response(buffer);
  return JSON.parse(respText);
}
```

## 构建

```bash
pnpm build
```

## 注意事项

Node 版本没有第三方依赖，适用于网页端的版本有如下依赖：

- `js-sha1@0.7.0`
- `base64-js@1.5.1`

运行环境支持信息：

- 浏览器支持: [Chrome 37+](https://caniuse.com/mdn-api_subtlecrypto)
- Node: [v17.4+](https://nodejs.org/docs/latest-v22.x/api/crypto.html#cryptosubtle)

## 其它

### Python 实现

参考 [`zzc_sign.py`](./qmweb/zzc_sign.py) 以及 [`ag1_cipher.py`](./qmweb/ag1_cipher.py)。

```bash
$ ./zzc_sign.py 123
sign=zzcec1b555gzqzg7laztguyjl2bu20r6x1w50c55f60 (len=43)
```
