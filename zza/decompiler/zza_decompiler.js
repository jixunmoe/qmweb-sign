/** @type {number[]} */
const vm = require('./zza_vm.json');

function zza_decompiler(pc, visited = new Set(), actions = []) {
  const vm_code = vm;

  const loc = (addr) => `loc_${addr.toString().padStart(4, '0')}`;
  const log = (msg) => actions.push(`    ${msg}`);

  const vm_handler = [
    function halt() {
      log('halt');
      return true;
    },
    function noop() {
      log('noop');
    },
    function setStackLen() {
      log(`stack.length = ${vm_code[pc++]}`);
    },
    function pushValue() {
      log(`push ${vm_code[pc++]}`);
    },
    function drop() {
      log('drop');
    },
    function swapN() {
      const offset = vm_code[pc++];
      log(`swap ${offset}`);
    },
    function dup() {
      log(`dup`);
    },
    function swap2() {
      log(`swap`);
    },
    function shiftWorld() {
      log(`*stack = [$world, *stack]`);
    },
    function makeArray() {
      log(`*stack = [*stack]`);
    },
    function getObjectObject() {
      log(`[obj, key] = stack.pop()`);
      log(`push obj[key]`);
    },
    function pushLoc() {
      log('idx = *stack.pop()');
      log('push *stack[idx]');
    },
    function setObjectValue() {
      log(`temp = *stack`);
      log(`[obj, key] = stack[-1]`);
      log(`obj[key] = temp`);
    },
    function setLoc() {
      log(`idx = *stack[-1]`);
      log(`*stack[idx] = *stack`);
    },
    function makeArrayWithValue() {
      log(`value = pop()`);
      log(`[obj, key] = pop()`);
      log(`push [obj[key], value]`);
    },
    function makeArrayByIdx() {
      log(`value = pop()`);
      log(`idx = pop()`);
      log(`push [*stack[idx], value]`);
    },
    function deleteObjectKey() {
      log(`[obj, key] = pop()`);
      log(`ok = delete obj[key]`);
      log(`push ok`);
    },
    function mapToKeys() {
      log(`obj = pop()`);
      log(`push keys(obj)`);
    },
    function shift() {
      log(`arr = *stack`);
      log(`push arr.shift()`);
      log(`push shift_ok`);
    },
    function configureGetter() {
      log(`[obj, key] = stack[-1]`);
      log(`obj.get$key = *stack`);
    },
    function configureSetter() {
      log(`[obj, key] = stack[-1]`);
      log(`obj.set$key = *stack`);
    },
    function jmp() {
      pc = vm_code[pc++];
      log(`jmp ${loc(pc)}`);
    },
    function jmpTrue() {
      const jmpTarget = vm_code[pc++];
      log(`if (*stack) goto ${loc(jmpTarget)}`);
      zza_decompiler(pc, visited, actions);
      zza_decompiler(jmpTarget, visited, actions);
      return true; // stop
    },
    function throwValue() {
      log(`throw *stack`);
    },
    function callN() {
      const argCount = vm_code[pc++];
      log(`call.${argCount} # drop_args ${argCount}; call stack.pop(); push result`);
    },
    function callN_ctx() {
      const argCount = vm_code[pc++];
      log(`call_this.${argCount} # drop_args ${argCount}; [ctx, name] = stack.pop(); call ctx[name]; push result`);
    },
    function call_ctor() {
      const argCount = vm_code[pc++];
      log(`call.ctor.${argCount} # drop_args ${argCount}; fn = stack.pop(); call new fn; push instance`);
    },
    function callCtorIndirect() {
      const argCount = vm_code[pc++];
      log(`call.ctor.${argCount} # drop_args ${argCount}; [obj, name] = stack.pop(); call new obj[name]; push result`);
    },
    function bNot() {
      log(`*stack = !*stack`);
    },
    function lNot() {
      log(`*stack = ~*stack`);
    },
    function getType() {
      log(`*stack = typeof *stack`);
    },
    function eqeq() {
      log(`eqeq`);
    },
    function eqeqeq() {
      log(`eqeqeq`);
    },
    function gt() {
      log(`gt`);
    },
    function gte() {
      log(`gte`);
    },
    function shl() {
      log(`shl`);
    },
    function shr() {
      log(`shr`);
    },
    function signed_shr() {
      log(`shr.signed`);
    },
    function add() {
      log(`add`);
    },
    function sub() {
      log(`sub`);
    },
    function mul() {
      log(`mul`);
    },
    function div() {
      log(`div`);
    },
    function mod() {
      log(`mod`);
    },
    function bOr() {
      log(`or`);
    },
    function bAnd() {
      log(`and`);
    },
    function bXor() {
      log(`xor`);
    },
    function hasKey() {
      log(`obj = pop(); key = pop(); push (key in obj)`);
    },
    function instOf() {
      log(`obj = pop(); key = pop(); push (key instanceof obj)`);
    },
    function initLoc() {
      log(`[idx] = pop()`);
      log(`stack[idx] ??= []`);
    },
    function makeVmFunction() {
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
    function pushErrorHandler() {
      const handlerPc = vm_code[pc++];
      const errorStoreLoc = vm_code[pc++];
      log(`| .error = &stack[${errorStoreLoc}]`);
      log(`.try ... catch @ ${loc(handlerPc)}`);
    },
    function popErrorHandler() {
      log(`.end_catch`);
    },
    function hasErrorCaptured() {
      log(`if error -> halt`);
    },
    function unsetErrorCaptured() {
      log(`.clear_error_captured`);
    },
    function addChar() {
      const code = vm_code[pc++];
      const chr = String.fromCharCode(code);
      log(`char ${JSON.stringify(chr)} # ${code}, 0x${code.toString(16)}`);
    },
    function pushEmptyStr() {
      log(`push ''`);
    },
    function pushVoid() {
      log(`push undefined`);
    },
    function pushNull() {
      log(`push null`);
    },
    function pushTrue() {
      log(`push true`);
    },
    function pushFalse() {
      log(`push false`);
    },
    function dropN() {
      const n = vm_code[pc++];
      log(`drop ${n}`);
    },
    function setConst() {
      const value = vm_code[pc++];
      log(`*stack = ${value}`);
    },
    function objSetValue() {
      log(`[idx] = pop()`);
      log(`[obj, key] = *stack`);
      log(`*stack[idx] = obj[key]`);
    },
    function objSetValueFromObjValue() {
      log(`[src, src_key] = pop()`);
      log(`[dst, dst_key] = *stack`);
      log(`dst[dst_key] = src[src_key]`);
    },
    function setArrayFirstValue() {
      log(`[src_idx] = pop()`);
      log(`[dst_idx] = *stack`);
      log(`*stack[dst_idx] = *stack[src_idx]`);
    },
    function setIndirectFirstItemByObjAccess() {
      log(`[src, src_key] = pop()`);
      log(`[dst_idx] = *stack`);
      log(`*stack[dst_idx] = src[src_key]`);
    },
    function lt() {
      log(`lt`);
    },
    function lte() {
      log(`lte`);
    },
  ];

  while (true) {
    const realPc = pc;
    const opcode = vm[pc++];
    const handler = vm_handler[opcode];
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

module.exports = { zza_decompiler };
