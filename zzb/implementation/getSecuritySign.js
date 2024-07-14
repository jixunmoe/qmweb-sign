const crypto = require('node:crypto');

/**
 * @param {string} text
 * @returns {Buffer}
 */
function md5(text) {
  const hashInst = crypto.createHash('md5');
  hashInst.update(text);
  return hashInst.digest();
}

/**
 * Sign payload (zzb)
 * @param {string} payload
 * @returns {string}
 */
function getSecuritySign(payload) {
  const digest = md5(payload);
  const hash = digest.toString('hex').toLowerCase();
  const idx1 = [21, 4, 9, 26, 16, 20, 27, 30];
  const idx2 = [18, 11, 3, 2, 1, 7, 6, 25];
  const scramble = [212, 45, 80, 68, 195, 163, 163, 203, 157, 220, 254, 91, 204, 79, 104, 6];

  const part1 = idx1.map((idx) => hash[idx]).join('');
  const part2 = idx2.map((idx) => hash[idx]).join('');
  const part3 = Buffer.from(scramble.map((value, i) => value ^ digest[i]))
    .toString('base64')
    .replace(/[\\/+=]/g, '')
    .toLowerCase();

  return 'zzb' + part1 + part3 + part2;
}

module.exports = getSecuritySign;
