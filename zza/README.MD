# QQMusic Sign (Web, v1)

Source: [`index.umd.js`][zza_src] | [Archive.org][zza_mirror]

[zza_src]: https://y.qq.com/component/m/qmfe-security-sign/index.umd.js?max_age=2592000
[zza_mirror]: https://web.archive.org/web/2020*/https://y.qq.com/component/m/qmfe-security-sign/index.umd.js?max_age=2592000

Other sources:

- `vendor.chunk.e34c43cb6bbbf0259a84.js`: `Mon, 19 Apr 2021 03:32:33 GMT`

Directory structure:

- `/` - This directory
  - `decompiled/` - Decompiled output of a given function
    - `analysis/` - Manual analysis + simplification
  - `decompiler/` - Source of the decompiler
  - `emulate/` - Attempt to run the original VMed function within a mock environment.
  - `original/` - Original copy of the file (minified original + prettified copy) 
  - `implementation/` - Re-implemented using clean JavaScript.

## Functions

### `fn_72(min, max)`

Description: Generate random chars

```javascript
function fn_72(min, max) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const len = Math.floor(min + (max - min + 1) * Math.random());
    let result = '';
    for(let i = 0; i < len; i++) {
        result += chars[Math.floor(Math.random() * chars.length)]
    }
    return result;
}
```

### `fn_444()`

Description: Find global object (i.e. `window`)

### `fn_0()`

Description: Bootstrap

```javascript
// define: fn_72
// define: global
global.__getSecuritySign = fn_771 // inlined
```

### `fn_771`

Description: Generate security sign.

```py
    # Check host and assign correct salt.
loc_0907: # opcode=55, handler=pushEmptyStr
    push ($world.location.host.indexOf("y.qq.com") === -1)
loc_0932:
    if (*stack) goto loc_0963 # bad
    
loc_0963: 
    push = fn_72(8, 10)
    jmp loc_0974
loc_0935: # opcode=55, handler=pushEmptyStr
    push = 'CJBPACrRuNy7'
loc_0974:
    *stack[9] = pop()

    # Get hash
    push [global, "__sign_hash_20200305"]
    push *stack[9] + *stack[3]    <- tmp = salt_1 + arg[0] 
    global.__sign_hash_20200305(tmp) <- hash = md5(salt_1 + arg[0])
    *stack[10] = hash

    # Get rand_str
    push [11]
    push *stack[12] # fn_72
    push 10
    push 53 - 37
loc_1103: # opcode=24, handler=callN
    rand_str = fn_72(10, 53 - 37)
    *stack[11] = rand_str
    drop
    drop

loc_1108: # opcode=55, handler=pushEmptyStr
    push 'zza'
    push *stack[11] # rand_str
    add
    
    push *stack[10] # hash
    add
    
loc_1125: # opcode=0, handler=halt
    halt
```

Implementation:

```javascript
// alias: __getSecuritySign
function fn_771(payload) {
    const hostValidationOk = location.host.indexOf("y.qq.com") !== -1;
    const salt_1 = hostValidationOk ? 'CJBPACrRuNy7' : fn_72(8, 10);
    const hash = __sign_hash_20200305(salt_1 + payload);

    const rand_str = fn_72(10, 53 - 37);
    return "zza" + rand_str + hash;
}
```
