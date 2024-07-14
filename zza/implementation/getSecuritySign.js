const crypto = require('node:crypto');

/**
 * @param {string} text
 * @returns {string}
 */
function md5(text) {
  const hashInst = crypto.createHash('md5');
  hashInst.update(text);
  return hashInst.digest('hex');
}

/**
 * Generate random string of given length.
 * @param {number} min
 * @param {number} max
 * @returns {string} Generated string.
 */
function fn_72(min, max) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const len = Math.floor(min + (max - min + 1) * Math.random());
  let result = '';
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * Sign payload (zza)
 * @param {string} payload
 * @returns {string}
 */
function getSecuritySign(payload) {
  const hash = md5('CJBPACrRuNy7' + payload);
  const rand_str = fn_72(10, 53 - 37);
  return 'zza' + rand_str + hash;
}

module.exports = getSecuritySign;
