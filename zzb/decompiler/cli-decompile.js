const fs = require('node:fs');
const { zzb_decompiler } = require('./zzb_decompiler');

const pc = Number(process.argv[2] || '0');

const visited = new Set();
const actions = [];
zzb_decompiler(pc, visited, actions);

fs.mkdirSync(`${__dirname}/../decompiled/analysis`, { recursive: true });

fs.writeFileSync(`${__dirname}/../decompiled/fn_${pc}.log`, actions.join('\n'), 'utf-8');
if (!fs.existsSync(`${__dirname}/../decompiled/analysis/d_fn_${pc}.log`)) {
  fs.writeFileSync(`${__dirname}/../decompiled/analysis/d_fn_${pc}.log`, '', { flag: 'wx' });
}
