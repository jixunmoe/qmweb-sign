const input = process.argv[2] || '123';
const zza = require('./zza');
const getSecuritySign = require('../implementation/getSecuritySign');

const sign = zza(input);
const signImpl = getSecuritySign(input);
console.log('sign(emu ) ', sign.padStart(52));
console.log('sign(impl) ', signImpl.padStart(52));
