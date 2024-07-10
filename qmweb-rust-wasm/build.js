// Execute this script after performing wasm-build.

const fs = require('node:fs');

const FILE_PATH = "pkg/qmweb_sign.js"
const WASM_PATH = "pkg/qmweb_sign_bg.wasm"
const FILE_PATH_OUT_MJS = "pkg/qmweb_sign_loader.mjs"

const wasm = fs.readFileSync(WASM_PATH);

/**
 * @param {string} name
 * @param {Buffer} buffer
 */
function buildCodeForBuffer(name, buffer) {
    const dict = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const realSize = buffer.byteLength;
    let paddingSize = 0;
    if (realSize % 3 !== 0) {
        paddingSize = 3 - (realSize % 3);
        buffer = Buffer.concat([Buffer.alloc(paddingSize), buffer]);
    }
    const bufferSize = buffer.byteLength;
    const bufferB64 = buffer.toString('base64');
    const encoded = bufferB64.split('').reverse().join('');

    return `
    const ${name}_bytes = new Uint8Array(${bufferSize});
    for (let
        dict = "${dict}".split('').reduce((r, c, i) => ({...r, [c]: i})),
        i = ${bufferSize},
        j = 0,
        c,
        outputIdx = [0, 8, 16],
        getWord = () => [0,6,12,18].reduce((acc, shl) => acc + (dict[${JSON.stringify(encoded)}[j++]] << shl), 0)
      ;
        (c = getWord(), outputIdx).map(x => ${name}_bytes[--i] = (c >> x)),
        i;
      );

    const ${name} = ${paddingSize ? `${name}_bytes.slice(${paddingSize})` : `${name}_bytes`};
`;
}

let loader = fs.readFileSync(FILE_PATH, 'utf-8');

loader = loader
    .replace(/(const cached)(TextEncoder|TextDecoder).*/gm, '$1$2 = new $2')
    .replace(/typeof (TextDecoder|cachedTextEncoder.encodeInto)/g, `("function")`)
    .replace(/^(export\s+(default|\{))/gm, '// $1')
    .replace(/(__wbg_init.__wbindgen_wasm_module = )/, '// $1')
    .replace(/module instanceof WebAssembly\.Module/g, 'true')
    .replace(/import\.meta\.url/g, '""')
    .replace(/Uint8Array/, 'RenamedUint8Array');

loader = `const RenamedUint8Array = Uint8Array;
${loader}

${buildCodeForBuffer("qmweb_sign", wasm)}
initSync(new WebAssembly.Module(qmweb_sign));
`;


fs.writeFileSync(FILE_PATH_OUT_MJS, loader, 'utf-8');
