const { zza_decompiler } = require('./zza_decompiler');
const fs = require('node:fs');

const pc = Number(process.argv[2] || '0');

const visited = new Set();
const actions = [];
zza_decompiler(pc, visited, actions);

fs.mkdirSync(`${__dirname}/../decompiled`, { recursive: true });
fs.writeFileSync(`${__dirname}/../decompiled/fn_${pc}.log`, actions.join('\n'), 'utf-8');
