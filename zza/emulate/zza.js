const { md5 } = require('../../shared/hash_20200305');
const zza_vm = require('../decompiler/zza_vm.json');

// var world = (function () {
//   if ('undefined' != typeof self) return self;
//   if ('undefined' != typeof window) return window;
//   if ('undefined' != typeof global) return global;
//   throw new Error('unable to locate global object');
// })();
// world.__sign_hash_20200305 = md5;

const $world = {
  window: null,
  Math,
  Object,
  Array,
  RegExp,
  hello: 'mocked global',
  location: { host: 'y.qq.com.jixun.uk' },
  Error,

  __sign_hash_20200305: md5,
};
$world.window = $world;

function runVM(unknown, pc, vm_code, $world, stack) {
  stack = stack || [[this], [{}]];

  const vm_handlers = [
    function halt() {
      return true;
    },
    function noop() {},
    function setStackLen() {
      stack.length = vm_code[pc++];
    },
    function pushValue() {
      stack.push(vm_code[pc++]);
    },
    function drop() {
      stack.pop();
    },
    function swapN() {
      const offset = vm_code[pc++];
      const temp = stack[stack.length - 2 - offset];
      stack[stack.length - 2 - offset] = stack.pop();
      stack.push(temp);
    },
    function dup() {
      stack.push(stack[stack.length - 1]);
    },
    function swap2() {
      stack.push([stack.pop(), stack.pop()].reverse());
    },
    function shiftWorld() {
      const value = stack.pop();
      // console.log(`prepare $world.${value}`);
      stack.push([$world, value]);
    },
    function makeArray() {
      stack.push([stack.pop()]);
    },
    function getObjectObject() {
      const [obj, key] = stack.pop();
      stack.push(obj[key]);
    },
    function pushLoc() {
      const idx = stack.pop()[0];
      stack.push(stack[idx][0]);
    },
    function setObjectValue() {
      const [obj, key] = stack[stack.length - 2];
      obj[key] = stack[stack.length - 1];
    },
    function setLoc() {
      const idx = stack[stack.length - 2][0];
      stack[idx][0] = stack[stack.length - 1];
    },
    function makeArrayWithValue() {
      const value = stack.pop();
      const [obj, key] = stack.pop();
      stack.push([obj[key], value]);
    },
    function makeArrayByIdx() {
      const value = stack.pop();
      const idx = stack.pop();
      stack.push([stack[idx][0], value]);
    },
    function deleteObjectKey() {
      const [obj, key] = stack.pop();
      const ok = delete obj[key];
      stack.push(ok);
    },
    function mapToKeys() {
      const arrayOrObj = stack.pop();
      const newArray = [];
      for (const idx in arrayOrObj) {
        newArray.push(idx);
      }
      stack.push(newArray);
    },
    function shift() {
      if (stack[stack.length - 1].length) {
        const value = stack[stack.length - 1].shift();
        stack.push(value, true);
      } else {
        stack.push(undefined, false);
      }
    },
    function configureGetter() {
      var [obj, key] = stack[stack.length - 2];
      const descriptor = Object.getOwnPropertyDescriptor(obj, key) || {
        configurable: true,
        enumerable: true,
      };
      descriptor.get = stack[stack.length - 1];
      Object.defineProperty(obj, key, descriptor);
    },
    function configureSetter() {
      const [obj, key] = stack[stack.length - 2];
      const t = Object.getOwnPropertyDescriptor(obj, key) || {
        configurable: true,
        enumerable: true,
      };
      t.set = stack[stack.length - 1];
      Object.defineProperty(obj, key, t);
    },
    function jmp() {
      pc = vm_code[pc++];
    },
    function jmpTrue() {
      const address = vm_code[pc++];
      if (stack[stack.length - 1]) {
        pc = address;
      }
    },
    function throwValue() {
      throw stack[stack.length - 1];
    },
    function callN() {
      const argCount = vm_code[pc++];
      const args = argCount ? stack.slice(-argCount) : [];
      stack.length -= argCount;
      const fn = stack.pop();
      const result = fn.apply($world, args);
      stack.push(result);
    },
    function callN_ctx() {
      const argCount = vm_code[pc++];
      const args = argCount ? stack.slice(-argCount) : [];
      stack.length -= argCount;
      const [ctx, name] = stack.pop();
      stack.push(ctx[name].apply(ctx, args));
    },
    function call_ctor() {
      const argCount = vm_code[pc++];
      const args = argCount ? stack.slice(-argCount) : [];
      stack.length -= argCount;
      args.unshift(null);
      const ctor = stack.pop();
      stack.push(new (Function.prototype.bind.apply(ctor, args))());
    },
    function callCtorIndirect() {
      const argCount = vm_code[pc++];
      const args = argCount ? stack.slice(-argCount) : [];
      stack.length -= argCount;
      args.unshift(null);
      const [ctx, name] = stack.pop();
      stack.push(new (Function.prototype.bind.apply(ctx[name], args))());
    },
    function bNot() {
      stack.push(!stack.pop());
    },
    function lNot() {
      stack.push(~stack.pop());
    },
    function getType() {
      const value = stack.pop();
      stack.push(typeof value);
    },
    function eqeq() {
      stack[stack.length - 2] = stack[stack.length - 2] == stack.pop();
    },
    function eqeqeq() {
      stack[stack.length - 2] = stack[stack.length - 2] === stack.pop();
    },
    function gt() {
      stack[stack.length - 2] = stack[stack.length - 2] > stack.pop();
    },
    function gte() {
      stack[stack.length - 2] = stack[stack.length - 2] >= stack.pop();
    },
    function shl() {
      stack[stack.length - 2] = stack[stack.length - 2] << stack.pop();
    },
    function shr() {
      stack[stack.length - 2] = stack[stack.length - 2] >> stack.pop();
    },
    function signed_shr() {
      stack[stack.length - 2] = stack[stack.length - 2] >>> stack.pop();
    },
    function add() {
      stack[stack.length - 2] = stack[stack.length - 2] + stack.pop();
    },
    function sub() {
      stack[stack.length - 2] = stack[stack.length - 2] - stack.pop();
    },
    function mul() {
      stack[stack.length - 2] = stack[stack.length - 2] * stack.pop();
    },
    function div() {
      stack[stack.length - 2] = stack[stack.length - 2] / stack.pop();
    },
    function mod() {
      stack[stack.length - 2] = stack[stack.length - 2] % stack.pop();
    },
    function bOr() {
      stack[stack.length - 2] = stack[stack.length - 2] | stack.pop();
    },
    function bAnd() {
      stack[stack.length - 2] = stack[stack.length - 2] & stack.pop();
    },
    function bXor() {
      stack[stack.length - 2] = stack[stack.length - 2] ^ stack.pop();
    },
    function hasKey() {
      stack[stack.length - 2] = stack[stack.length - 2] in stack.pop();
    },
    function instOf() {
      stack[stack.length - 2] = stack[stack.length - 2] instanceof stack.pop();
    },
    function defaultToEmptyArray() {
      const temp = stack[stack.length - 1][0];
      stack[temp] = void 0 === stack[temp] ? [] : stack[temp];
    },
    function makeVmFunction() {
      const nextEntryPoint = vm_code[pc++];
      const initialStackLen = vm_code[pc++];
      const argsIdxOrderLen = vm_code[pc++];

      const initialStack = [];
      const argOrderIndex = [];

      for (let i = 0; i < initialStackLen; i++) {
        initialStack[vm_code[pc++]] = stack[vm_code[pc++]];
      }
      for (let i = 0; i < argsIdxOrderLen; i++) {
        argOrderIndex[i] = vm_code[pc++];
      }

      function vm_func() {
        const fnStack = initialStack.slice(0);
        fnStack[0] = [this];
        fnStack[1] = [arguments];
        fnStack[2] = [initialStackLen];

        for (let i = 0; i < argOrderIndex.length && i < arguments.length; i++) {
          if (argOrderIndex[i] > 0) {
            fnStack[argOrderIndex[i]] = [arguments[i]];
          }
        }
        return runVM(unknown, nextEntryPoint, vm_code, $world, fnStack);
      }

      vm_func.$$name = `vm(${nextEntryPoint})`;
      vm_func.$$init = initialStack;

      stack.push(vm_func);
    },
    function pushErrorHandler() {
      errorHandlers.push([vm_code[pc++], stack.length, vm_code[pc++]]);
    },
    function popErrorHandler() {
      errorHandlers.pop();
    },
    function hasErrorCaptured() {
      return !!errorCaptured;
    },
    function unsetErrorCaptured() {
      errorCaptured = null;
    },
    function addChar() {
      const chr = String.fromCharCode(vm_code[pc++]);
      stack[stack.length - 1] += chr;

      // log('addChar(%s, %s)', JSON.stringify([stack.length - 1]), JSON.stringify(chr));
    },
    function pushEmptyStr() {
      stack.push('');
    },
    function pushVoid() {
      stack.push(void 0);
    },
    function pushNull() {
      stack.push(null);
    },
    function pushTrue() {
      stack.push(true);
    },
    function pushFalse() {
      stack.push(false);
    },
    function dropN() {
      const n = vm_code[pc++];
      stack.length -= n;
    },
    function setConst() {
      const value = vm_code[pc++];
      stack[stack.length - 1] = value;
      // log('pop; push %d', value);
    },
    function objSetValue() {
      const [idx] = stack.pop();
      const [obj, key] = stack[stack.length - 1];
      obj[key] = stack[idx][0];
    },
    function objSetValueFromObjValue() {
      const [obj1, key1] = stack.pop();
      const [obj2, key2] = stack[stack.length - 1];
      obj2[key2] = obj1[key1];
    },
    function setArrayFirstValue() {
      const [idx1] = stack.pop();
      const [idx2] = stack[stack.length - 1];
      stack[idx2][0] = stack[idx1][0];
    },
    function setIndirectFirstItemByObjAccess() {
      const [obj, key] = stack.pop();
      const [idx1] = stack[stack.length - 1];
      stack[idx1][0] = obj[key];
    },
    function lt() {
      stack[stack.length - 2] = stack[stack.length - 2] < stack.pop();
    },
    function lte() {
      stack[stack.length - 2] = stack[stack.length - 2] <= stack.pop();
    },
  ];

  const errorHandlers = [];
  let errorCaptured = null;
  while (true) {
    try {
      let halt = false;
      while (!halt) {
        const opcode = vm_code[pc++];
        halt = vm_handlers[opcode]();
      }

      if (errorCaptured) throw errorCaptured;
      return stack.pop();
    } catch (err) {
      const errorHandler = errorHandlers.pop();
      if (errorHandler === undefined) throw err;
      errorCaptured = err;

      // [pc, stack_length, error_var_idx]
      pc = errorHandler[0];
      stack.length = errorHandler[1];
      if (errorHandler[2]) {
        stack[errorHandler[2]][0] = errorCaptured;
      }
    }
  }
}

runVM(120731, 0, zza_vm, $world);

var __getSecuritySign = $world.__getSecuritySign;
delete $world.__getSecuritySign;
module.exports = __getSecuritySign;
