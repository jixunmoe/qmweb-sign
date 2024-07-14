const input = process.argv[2] || '123';
const zzb = require('./zzb');
const getSecuritySign = require('../implementation/getSecuritySign');

// "123" => "zzb7bc290379ahpjm6pjalllo4wwjdg49c2026d"
// "hello world" => "zzb230592aciptryo9trsof9zgqxwlxqce6bebbf"
// "jixun.uk" => "zzb567761769fo8u1qhgtz1qsogzjszg7277071f"

const sign = zzb(input);
console.log('zzb : %s', sign);

const implSign = getSecuritySign(input);
console.log('impl: %s', implSign);
