function md5(e) {
  function t(e, t) {
    var n = (65535 & e) + (65535 & t);
    return (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n);
  }

  function n(e, n, r, i, o, a) {
    return t(((u = t(t(n, e), t(i, a))) << (l = o)) | (u >>> (32 - l)), r);
    var u, l;
  }

  function r(e, t, r, i, o, a, u) {
    return n((t & r) | (~t & i), e, t, o, a, u);
  }

  function i(e, t, r, i, o, a, u) {
    return n((t & i) | (r & ~i), e, t, o, a, u);
  }

  function o(e, t, r, i, o, a, u) {
    return n(t ^ r ^ i, e, t, o, a, u);
  }

  function a(e, t, r, i, o, a, u) {
    return n(r ^ (t | ~i), e, t, o, a, u);
  }

  function u(e) {
    return (function (e) {
      var t,
        n = '';
      for (t = 0; t < 32 * e.length; t += 8) n += String.fromCharCode((e[t >> 5] >>> t % 32) & 255);
      return n;
    })(
      (function (e, n) {
        (e[n >> 5] |= 128 << n % 32), (e[14 + (((n + 64) >>> 9) << 4)] = n);
        var u,
          l,
          c,
          s,
          f,
          p = 1732584193,
          d = -271733879,
          h = -1732584194,
          v = 271733878;
        for (u = 0; u < e.length; u += 16)
          (l = p),
            (c = d),
            (s = h),
            (f = v),
            (p = r(p, d, h, v, e[u], 7, -680876936)),
            (v = r(v, p, d, h, e[u + 1], 12, -389564586)),
            (h = r(h, v, p, d, e[u + 2], 17, 606105819)),
            (d = r(d, h, v, p, e[u + 3], 22, -1044525330)),
            (p = r(p, d, h, v, e[u + 4], 7, -176418897)),
            (v = r(v, p, d, h, e[u + 5], 12, 1200080426)),
            (h = r(h, v, p, d, e[u + 6], 17, -1473231341)),
            (d = r(d, h, v, p, e[u + 7], 22, -45705983)),
            (p = r(p, d, h, v, e[u + 8], 7, 1770035416)),
            (v = r(v, p, d, h, e[u + 9], 12, -1958414417)),
            (h = r(h, v, p, d, e[u + 10], 17, -42063)),
            (d = r(d, h, v, p, e[u + 11], 22, -1990404162)),
            (p = r(p, d, h, v, e[u + 12], 7, 1804603682)),
            (v = r(v, p, d, h, e[u + 13], 12, -40341101)),
            (h = r(h, v, p, d, e[u + 14], 17, -1502002290)),
            (p = i(p, (d = r(d, h, v, p, e[u + 15], 22, 1236535329)), h, v, e[u + 1], 5, -165796510)),
            (v = i(v, p, d, h, e[u + 6], 9, -1069501632)),
            (h = i(h, v, p, d, e[u + 11], 14, 643717713)),
            (d = i(d, h, v, p, e[u], 20, -373897302)),
            (p = i(p, d, h, v, e[u + 5], 5, -701558691)),
            (v = i(v, p, d, h, e[u + 10], 9, 38016083)),
            (h = i(h, v, p, d, e[u + 15], 14, -660478335)),
            (d = i(d, h, v, p, e[u + 4], 20, -405537848)),
            (p = i(p, d, h, v, e[u + 9], 5, 568446438)),
            (v = i(v, p, d, h, e[u + 14], 9, -1019803690)),
            (h = i(h, v, p, d, e[u + 3], 14, -187363961)),
            (d = i(d, h, v, p, e[u + 8], 20, 1163531501)),
            (p = i(p, d, h, v, e[u + 13], 5, -1444681467)),
            (v = i(v, p, d, h, e[u + 2], 9, -51403784)),
            (h = i(h, v, p, d, e[u + 7], 14, 1735328473)),
            (p = o(p, (d = i(d, h, v, p, e[u + 12], 20, -1926607734)), h, v, e[u + 5], 4, -378558)),
            (v = o(v, p, d, h, e[u + 8], 11, -2022574463)),
            (h = o(h, v, p, d, e[u + 11], 16, 1839030562)),
            (d = o(d, h, v, p, e[u + 14], 23, -35309556)),
            (p = o(p, d, h, v, e[u + 1], 4, -1530992060)),
            (v = o(v, p, d, h, e[u + 4], 11, 1272893353)),
            (h = o(h, v, p, d, e[u + 7], 16, -155497632)),
            (d = o(d, h, v, p, e[u + 10], 23, -1094730640)),
            (p = o(p, d, h, v, e[u + 13], 4, 681279174)),
            (v = o(v, p, d, h, e[u], 11, -358537222)),
            (h = o(h, v, p, d, e[u + 3], 16, -722521979)),
            (d = o(d, h, v, p, e[u + 6], 23, 76029189)),
            (p = o(p, d, h, v, e[u + 9], 4, -640364487)),
            (v = o(v, p, d, h, e[u + 12], 11, -421815835)),
            (h = o(h, v, p, d, e[u + 15], 16, 530742520)),
            (p = a(p, (d = o(d, h, v, p, e[u + 2], 23, -995338651)), h, v, e[u], 6, -198630844)),
            (v = a(v, p, d, h, e[u + 7], 10, 1126891415)),
            (h = a(h, v, p, d, e[u + 14], 15, -1416354905)),
            (d = a(d, h, v, p, e[u + 5], 21, -57434055)),
            (p = a(p, d, h, v, e[u + 12], 6, 1700485571)),
            (v = a(v, p, d, h, e[u + 3], 10, -1894986606)),
            (h = a(h, v, p, d, e[u + 10], 15, -1051523)),
            (d = a(d, h, v, p, e[u + 1], 21, -2054922799)),
            (p = a(p, d, h, v, e[u + 8], 6, 1873313359)),
            (v = a(v, p, d, h, e[u + 15], 10, -30611744)),
            (h = a(h, v, p, d, e[u + 6], 15, -1560198380)),
            (d = a(d, h, v, p, e[u + 13], 21, 1309151649)),
            (p = a(p, d, h, v, e[u + 4], 6, -145523070)),
            (v = a(v, p, d, h, e[u + 11], 10, -1120210379)),
            (h = a(h, v, p, d, e[u + 2], 15, 718787259)),
            (d = a(d, h, v, p, e[u + 9], 21, -343485551)),
            (p = t(p, l)),
            (d = t(d, c)),
            (h = t(h, s)),
            (v = t(v, f));
        return [p, d, h, v];
      })(
        (function (e) {
          var t,
            n = [];
          for (n[(e.length >> 2) - 1] = void 0, t = 0; t < n.length; t += 1) n[t] = 0;
          for (t = 0; t < 8 * e.length; t += 8) n[t >> 5] |= (255 & e.charCodeAt(t / 8)) << t % 32;
          return n;
        })(e),
        8 * e.length,
      ),
    );
  }

  function l(e) {
    return u(unescape(encodeURIComponent(e)));
  }

  return (function (e) {
    var t,
      n,
      r = '';
    for (n = 0; n < e.length; n += 1)
      (t = e.charCodeAt(n)), (r += '0123456789abcdef'.charAt((t >>> 4) & 15) + '0123456789abcdef'.charAt(15 & t));
    return r;
  })(l(e));
}

exports.md5 = md5;
