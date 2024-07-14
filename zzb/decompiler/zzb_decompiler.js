/** @type {number[]} */
const vm = require('./zzb_vm.json');

function zzb_decompiler(pc, visited = new Set(), actions = []) {
  const vm_code = vm;

  const loc = (addr) => `loc_${addr.toString().padStart(4, '0')}`;
  const log = (msg) => actions.push(`    ${msg}`);

  const vm_handlers = [
    function add() {
      log('add');
    },
    function createVmFn() {
      const nextEntryPoint = vm_code[pc++];
      const initialStackLen = vm_code[pc++];
      const argsIdxOrderLen = vm_code[pc++];

      for (let i = 0; i < initialStackLen; i++) {
        const newLoc = vm_code[pc++];
        const oldLoc = vm_code[pc++];
        log(`| .init_stack[${newLoc}] <- stack[${oldLoc}]`);
      }
      for (let i = 0; i < argsIdxOrderLen; i++) {
        const loc = vm_code[pc++];
        log(`| .arg[${i}] -> &stack[${loc}]`);
      }
      log(`| .entrypoint = ${nextEntryPoint}`);
      log(`| .initialStackLen = ${initialStackLen}`);
      log(`| .argsIdxOrderLen = ${argsIdxOrderLen}`);
      log(`push vm_fn, ^args`);
    },
    function bOr() {
      log(`or`);
    },
    function pushIndirect() {
      const idx = vm_code[pc++];
      log(`push *stack[${idx}]`);
    },
    function swapN() {
      let n = vm_code[pc++];
      log(`swap ${n}`);
    },
    ,
    function invoke_n_ctx() {
      const argLen = vm_code[pc++];
      log(`.args = drop ${argLen}`);
      log(`.[ctx, name] = drop`);
      log(`push  result = ctx[name](...args)`);
    },
    ,
    ,
    function jmpTrue() {
      const jmpTarget = vm_code[pc++];
      log(`if (*stack) goto ${loc(jmpTarget)}`);
      zzb_decompiler(pc, visited, actions);
      zzb_decompiler(jmpTarget, visited, actions);
      return true; // stop
    },
    function invoke_n_ctor() {
      const argLen = vm_code[pc++];
      log(`.args = drop ${argLen}`);
      log(`.ctor = drop`);
      log(`push  new .ctro(...args)`);
    },
    function sub() {
      log(`sub`);
    },
    function obj_set() {
      log(`[[ctx, name], value] = stack[-2..]`);
      log(`ctx[name] = value`);
    },
    ,
    function initVar() {
      const offset = vm_code[pc++];
      log(`stack[${offset}] ??= []`);
    },
    ,
    function bNot() {
      log(`*stack = !*stack`);
    },
    ,
    ,
    ,
    function const_number_array() {
      const value = vm_code[pc++];
      log(`push [${value}]`);
    },
    function resolveGlobal() {
      log(`*stack = $world[*stack]`);
    },
    ,
    function pushEmptyStr() {
      log(`push ""`);
    },
    ,
    function shl() {
      log(`shl`);
    },
    ,
    function merge_arr_indirect() {
      log(`[idx, temp] = drop 2`);
      log(`push [*stack[idx], temp]`);
    },
    function indirect_get() {
      log(`[ [idx] ] = drop`);
      log(`push [*stack[idx]]`);
    },
    ,
    function mov() {
      const value = vm_code[pc++];
      log(`*stack = ${value}`);
    },
    function shr() {
      log(`shr`);
    },
    ,
    function const_false() {
      log(`push false`);
    },
    function gt() {
      log(`gt`);
    },
    ,
    function bXor() {
      log('xor');
    },
    function make_array() {
      log(`[a, b] = drop 2`);
      log(`push [a, b]`);
    },
    function drop() {
      log(`drop`);
    },
    function indirect_mov() {
      log(`[dst, src] = stack[-2..]`);
      log(`*stack[dst] = stack[src]`);
    },
    ,
    ,
    ,
    function dup() {
      log(`dup`);
    },
    ,
    function halt() {
      log('halt');
      return true;
    },
    function prepare_$world() {
      log(`*stack = [$world, *stack]`);
    },
    function invoke_n() {
      const argLen = vm_code[pc++];
      log(`.args = drop ${argLen}`);
      log(`.fn = drop`);
      log(`push  fn.call($world, ...args)`);
    },
    function gte() {
      log(`gte`);
    },
    ,
    ,
    function set_stack_length() {
      const stackLen = vm_code[pc++];
      log(`stack.resize ${stackLen}`);
    },
    ,
    function get_obj_value_merge() {
      log(`[[ctx, name], temp] = drop 2`);
      log(`push [ctx[name], temp]`);
    },
    ,
    function bAnd() {
      log('and');
    },
    function jmp() {
      pc = vm_code[pc++];
      log(`jmp ${loc(pc)}`);
    },
    ,
    function char() {
      const code = vm_code[pc++];
      const chr = String.fromCharCode(code);
      log(`char ${JSON.stringify(chr)} # ${code}, 0x${code.toString(16)}`);
    },
    ,
    ,
    function eqeqeq() {
      log(`eqeqeq`);
    },
    function const_undefined() {
      log(`push undefined`);
    },
    function obj_access() {
      log(`[ctx, name] = drop`);
      log(`push ctx[name]`);
    },
    ,
    function const_true() {
      log(`push true`);
    },
    ,
    function mul() {
      log(`mul`);
    },
    function push() {
      const value = vm_code[pc++];
      log(`push ${value}`);
    },
    function getType() {
      log(`typeof`);
    },
  ];

  while (true) {
    const realPc = pc;
    const opcode = vm[pc++];
    const handler = vm_handlers[opcode];
    actions.push(`${loc(realPc)}: # opcode=${opcode}, handler=${handler.name}`);
    if (visited.has(realPc)) {
      log(`# skip (reason: visited)`);
      return;
    }
    visited.add(realPc);
    if (visited.size > 10_000) {
      log(`# halt (reason: too many address)`);
      return;
    }

    const halt = handler();
    if (halt) break;
  }
}

exports.zzb_decompiler = zzb_decompiler;
