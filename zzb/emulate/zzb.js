const { md5 } = require('../../shared/hash_20200305');
const vm_code = require('../decompiler/zzb_vm.json');

const DEBUG = false;

function module_145_loader(module) {
  var $world;
  $world = (function () {
    return this;
  })();
  try {
    $world = $world || new Function('return this')();
  } catch (r) {
    if ('object' === typeof window) {
      $world = window;
    }
  }
  module.exports = $world;
}

// function (module, exports, require) {
// 'use strict';
// require.r(exports);

const $world = {
  window: null,
  Object,
  Array,
  RegExp,
  hello: 'mocked global',
  navigator: { userAgent: 'Definitely Not Headless Chrome' },
  location: { host: 'jixun.uk' }, // y.qq.com

  __qmfe_sign_check: 1, // bypass environment check
};
$world.window = $world;

function moduleSetupSecurityModule($world_src) {
  const $world = $world_src;
  var getVM = (function () {
    function createVm(pc, vm_code, world, stack, o, a, u, l) {
      const noInitStack = !stack;
      pc = +pc;
      vm_code = vm_code || [0];
      stack = stack || [[this], [{}]];
      o = o || {};

      let errorHandlers = [];
      let errorCaught = null;
      // Function.prototype.bind polyfill
      function trap() {
        return true;
      }

      const vm_handlers = [
        function add() {
          stack[stack.length - 2] = stack[stack.length - 2] + stack.pop();
        },
        function createVmFn() {
          const entrypoint = vm_code[pc++];
          const initialStackLen = vm_code[pc++];
          const argStackLocationLen = vm_code[pc++];
          const fn_stack = [];
          const arg_loc = [];
          for (let i = 0; i < initialStackLen; i++) {
            fn_stack[vm_code[pc++]] = stack[vm_code[pc++]];
          }
          for (let i = 0; i < argStackLocationLen; i++) {
            arg_loc[i] = vm_code[pc++];
          }
          function vm_fn() {
            const stack = fn_stack.slice(0);
            stack[0] = [this];
            stack[1] = [arguments];
            stack[2] = [vm_fn];
            for (let i = 0; i < arg_loc.length && i < arguments.length; i++) {
              if (0 < arg_loc[i]) {
                stack[arg_loc[i]] = [arguments[i]];
              }
            }
            return createVm(entrypoint, vm_code, world, stack, o);
          }
          vm_fn.$$name = `vm(${entrypoint})`;
          vm_fn.toString = function () {
            return `[Function: vm(${entrypoint})]`;
          };
          stack.push(vm_fn);
        },
        function bOr() {
          stack[stack.length - 2] = stack[stack.length - 2] | stack.pop();
        },
        function pushIndirect() {
          stack.push(stack[vm_code[pc++]][0]);
        },
        function swapN() {
          let n = vm_code[pc++];
          let temp = stack[stack.length - 2 - n];
          stack[stack.length - 2 - n] = stack.pop();
          stack.push(temp);
        },
        ,
        function invoke_n_ctx() {
          const argLen = vm_code[pc++];
          const args = argLen ? stack.slice(-argLen) : [];
          stack.length -= argLen;

          const [ctx, name] = stack.pop();
          const result = ctx[name].apply(ctx, args);
          DEBUG &&
            console.log(`invoke .pc=${pc - 1} .ctx="${ctx}" .method="${name}" .args=(${args}) .result=(${result})`);
          // console.log(`invoke .pc=${pc - 1} .ctx="%o" .method="%o" .args=(%o) .result=(%o)`, ctx, name, args, result);
          stack.push(result);
        },
        ,
        ,
        function jmpTrue() {
          const addr = vm_code[pc++];
          if (stack[stack.length - 1]) {
            pc = addr;
          }
        },
        function invoke_n_ctor() {
          const argLen = vm_code[pc++];
          const args = argLen ? stack.slice(-argLen) : [];
          stack.length -= argLen;

          // Skip insert null ctx here:
          // args.unshift(null);

          const ctor = stack.pop();
          DEBUG && console.log(ctor, args);

          const instance = new ctor(...args);
          stack.push(instance);
        },
        function sub() {
          stack[stack.length - 2] = stack[stack.length - 2] - stack.pop();
        },
        function obj_set() {
          const [ctx, name] = stack[stack.length - 2];
          ctx[name] = stack[stack.length - 1];
        },
        ,
        function initVar() {
          const offset = vm_code[pc++];
          stack[offset] ??= [];
        },
        ,
        function bNot() {
          stack.push(!stack.pop());
        },
        ,
        ,
        ,
        function toArr() {
          stack.push([vm_code[pc++]]);
        },
        function getWorld() {
          stack[stack.length - 1] = world[stack[stack.length - 1]];
        },
        ,
        function pushEmptyStr() {
          stack.push('');
        },
        ,
        function shl() {
          stack[stack.length - 2] = stack[stack.length - 2] << stack.pop();
        },
        ,
        function merge_arr_indirect() {
          const top = stack.pop();
          const idx = stack.pop();
          const indirectItem = stack[idx][0];
          stack.push([indirectItem, top]);
        },
        function indirect_get() {
          stack.push(stack[stack.pop()[0]][0]);
        },
        ,
        function mov() {
          stack[stack.length - 1] = vm_code[pc++];
        },
        function shr() {
          stack[stack.length - 2] = stack[stack.length - 2] >> stack.pop();
        },
        ,
        function const_false() {
          stack.push(false);
        },
        function gt() {
          stack[stack.length - 2] = stack[stack.length - 2] > stack.pop();
        },
        ,
        function bXor() {
          stack[stack.length - 2] = stack[stack.length - 2] ^ stack.pop();
        },
        function make_array() {
          stack.push([stack.pop(), stack.pop()].reverse());
        },
        function drop() {
          stack.pop();
        },
        function indirect_mov() {
          // const [dst, src] = stack.slice(-2)
          // *stack[dst] = *src
          // 39
          const idx = stack[stack.length - 2][0];
          stack[idx][0] = stack[stack.length - 1];
        },
        ,
        ,
        ,
        function dup() {
          stack.push(stack[stack.length - 1]);
        },
        ,
        function halt() {
          return true;
        },
        function prepare_$world() {
          stack.push([world, stack.pop()]);
        },
        function invoke_n() {
          const argLen = vm_code[pc++];
          let args = argLen ? stack.slice(-argLen) : [];
          stack.length -= argLen;

          const fn = stack.pop();
          const result = fn.apply(world, args);
          stack.push(result);
        },
        function gte() {
          stack[stack.length - 2] = stack[stack.length - 2] >= stack.pop();
        },
        ,
        ,
        function set_stack_length() {
          stack.length = vm_code[pc++];
        },
        ,
        function get_obj_value_merge() {
          const value = stack.pop();
          const [ctx, name] = stack.pop();
          stack.push([ctx[name], value]);
        },
        ,
        function bAnd() {
          stack[stack.length - 2] = stack[stack.length - 2] & stack.pop();
        },
        function jmp() {
          pc = vm_code[pc++];
        },
        ,
        function char() {
          stack[stack.length - 1] += String.fromCharCode(vm_code[pc++]);
        },
        ,
        ,
        function eqeqeq() {
          stack[stack.length - 2] = stack[stack.length - 2] === stack.pop();
        },
        function const_undefined() {
          stack.push(undefined);
        },
        function obj_access() {
          const [ctx, name] = stack.pop();
          stack.push(ctx[name]);
        },
        ,
        function const_true() {
          stack.push(true);
        },
        ,
        function mul() {
          stack[stack.length - 2] = stack[stack.length - 2] * stack.pop();
        },
        function push() {
          stack.push(vm_code[pc++]);
        },
        function _typeof() {
          stack.push(typeof stack.pop());
        },
      ];

      while (true) {
        try {
          while (true) {
            const currPc = pc;
            const opcode = vm_code[pc++];
            // console.log(`pc=%d, opcode=%d`, currPc, opcode);
            const handler = vm_handlers[opcode];
            const halt = handler();
            if (halt) break;
          }
          if (errorCaught) throw errorCaught;

          return noInitStack ? (stack.pop(), stack.slice(3 + createVm.v)) : stack.pop();
        } catch (m) {
          var v = errorHandlers.pop();
          if (void 0 === v) throw m;
          (errorCaught = m), (pc = v[0]), (stack.length = v[1]), v[2] && (stack[v[2]][0] = errorCaught);
        }
      }
    }

    createVm.v = 5;

    return createVm(0, vm_code, $world);
  })();

  getVM.g = function () {
    return getVM.shift()[0]; // ?
  };

  $world.__sign_hash_20200305 = md5;
  const _getSecuritySign = $world._getSecuritySign;
  delete $world._getSecuritySign;
  // exports.default = _getSecuritySign
  return _getSecuritySign;
}

module.exports = moduleSetupSecurityModule($world);

// .
// call(this, require(145));
// }
