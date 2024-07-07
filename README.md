# `@jixun/qmweb-sign`

QQ 音乐 (y.qq.com) 请求签名算法，`zzc` 版本。

## 安装

```bash
pnpm i @jixun/qmweb-sign
```

## 使用

```js
// ModuleJS, bundler, etc
import { zzcSign } from '@jixun/qmweb-sign';

// CommonJS
const { zzcSign } = require('@jixun/qmweb-sign');
```

## 构建

```bash
pnpm build
```

## 注意事项

Node 版本没有第三方依赖，适用于网页端的版本有如下依赖：

- `js-sha1@0.7.0`
- `base64-js@1.5.1`

## Python 实现

参考 [`zzc_sign.py`](./zzc_sign.py)。

```bash
$ ./zzc_sign.py 123
sign=zzcec1b555gzqzg7laztguyjl2bu20r6x1w50c55f60 (len=43)
```
