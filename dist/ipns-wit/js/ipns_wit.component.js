import { cliBaseEnvironment as interface17, cliBaseExit as interface2, cliBasePreopens as interface12, cliBaseStderr as interface5, cliBaseStdin as interface3, cliBaseStdout as interface4 } from '@bytecodealliance/preview2-shim/cli-base';
import { clocksMonotonicClock as interface0, clocksWallClock as interface13 } from '@bytecodealliance/preview2-shim/clocks';
import { filesystemFilesystem as interface1 } from '@bytecodealliance/preview2-shim/filesystem';
import { ioStreams as interface6 } from '@bytecodealliance/preview2-shim/io';
import { ipnsPubsubImports as interface8 } from 'ipns-pubsub';

const base64Compile = str => WebAssembly.compile(typeof Buffer !== 'undefined' ? Buffer.from(str, 'base64') : Uint8Array.from(atob(str), b => b.charCodeAt(0)));

class ComponentError extends Error {
  constructor (value) {
    const enumerable = typeof value !== 'string';
    super(enumerable ? `${String(value)} (see error.payload)` : value);
    Object.defineProperty(this, 'payload', { value, enumerable });
  }
}

let dv = new DataView(new ArrayBuffer());
const dataView = mem => dv.buffer === mem.buffer ? dv : dv = new DataView(mem.buffer);

const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
let _fs;
async function fetchCompile (url) {
  if (isNode) {
    _fs = _fs || await import('fs/promises');
    return WebAssembly.compile(await _fs.readFile(url));
  }
  return fetch(url).then(WebAssembly.compileStreaming);
}

function getErrorPayload(e) {
  if (e && hasOwnProperty.call(e, 'payload')) return e.payload;
  return e;
}

const hasOwnProperty = Object.prototype.hasOwnProperty;

const instantiateCore = WebAssembly.instantiate;

const toUint64 = val => BigInt.asUintN(64, val);

function toUint32(val) {
  return val >>> 0;
}

const utf8Decoder = new TextDecoder();

const utf8Encoder = new TextEncoder();

let utf8EncodedLen = 0;
function utf8Encode(s, realloc, memory) {
  if (typeof s !== 'string') throw new TypeError('expected a string');
  if (s.length === 0) {
    utf8EncodedLen = 0;
    return 1;
  }
  let allocLen = 0;
  let ptr = 0;
  let writtenTotal = 0;
  while (s.length > 0) {
    ptr = realloc(ptr, allocLen, 1, allocLen + s.length);
    allocLen += s.length;
    const { read, written } = utf8Encoder.encodeInto(
    s,
    new Uint8Array(memory.buffer, ptr + writtenTotal, allocLen - writtenTotal),
    );
    writtenTotal += written;
    s = s.slice(read);
  }
  if (allocLen > writtenTotal)
  ptr = realloc(ptr, allocLen, 1, writtenTotal);
  utf8EncodedLen = writtenTotal;
  return ptr;
}

let exports0;
let exports1;
const lowering0Callee = interface0.now;
function lowering0() {
  const ret = lowering0Callee();
  return toUint64(ret);
}
const lowering1Callee = interface1.dropDescriptor;
function lowering1(arg0) {
  lowering1Callee(arg0 >>> 0);
}
const lowering2Callee = interface2.exit;
function lowering2(arg0) {
  let variant0;
  switch (arg0) {
    case 0: {
      variant0= {
        tag: 'ok',
        val: undefined
      };
      break;
    }
    case 1: {
      variant0= {
        tag: 'err',
        val: undefined
      };
      break;
    }
    default: {
      throw new TypeError('invalid variant discriminant for expected');
    }
  }
  lowering2Callee(variant0);
}
const lowering3Callee = interface3.getStdin;
function lowering3() {
  const ret = lowering3Callee();
  return toUint32(ret);
}
const lowering4Callee = interface4.getStdout;
function lowering4() {
  const ret = lowering4Callee();
  return toUint32(ret);
}
const lowering5Callee = interface5.getStderr;
function lowering5() {
  const ret = lowering5Callee();
  return toUint32(ret);
}
const lowering6Callee = interface6.dropInputStream;
function lowering6(arg0) {
  lowering6Callee(arg0 >>> 0);
}
const lowering7Callee = interface6.dropOutputStream;
function lowering7(arg0) {
  lowering7Callee(arg0 >>> 0);
}
let exports2;
let memory0;
const lowering8Callee = interface8.prnt;
function lowering8(arg0, arg1) {
  const ptr0 = arg0;
  const len0 = arg1;
  const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
  lowering8Callee(result0);
}
const lowering9Callee = interface8.publish;
function lowering9(arg0, arg1, arg2, arg3) {
  const ptr0 = arg0;
  const len0 = arg1;
  const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
  const ptr1 = arg2;
  const len1 = arg3;
  const result1 = new Uint8Array(memory0.buffer.slice(ptr1, ptr1 + len1 * 1));
  lowering9Callee({
    topic: result0,
    message: result1,
  });
}
const lowering10Callee = interface8.subscribe;
function lowering10(arg0, arg1) {
  const ptr0 = arg0;
  const len0 = arg1;
  const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
  lowering10Callee(result0);
}
const lowering11Callee = interface8.unsubscribe;
function lowering11(arg0, arg1) {
  const ptr0 = arg0;
  const len0 = arg1;
  const result0 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr0, len0));
  lowering11Callee(result0);
}
let realloc0;
const lowering12Callee = interface12.getDirectories;
function lowering12(arg0) {
  const ret = lowering12Callee();
  const vec2 = ret;
  const len2 = vec2.length;
  const result2 = realloc0(0, 0, 4, len2 * 12);
  for (let i = 0; i < vec2.length; i++) {
    const e = vec2[i];
    const base = result2 + i * 12;const [tuple0_0, tuple0_1] = e;
    dataView(memory0).setInt32(base + 0, toUint32(tuple0_0), true);
    const ptr1 = utf8Encode(tuple0_1, realloc0, memory0);
    const len1 = utf8EncodedLen;
    dataView(memory0).setInt32(base + 8, len1, true);
    dataView(memory0).setInt32(base + 4, ptr1, true);
  }
  dataView(memory0).setInt32(arg0 + 4, len2, true);
  dataView(memory0).setInt32(arg0 + 0, result2, true);
}
const lowering13Callee = interface13.now;
function lowering13(arg0) {
  const ret = lowering13Callee();
  const {seconds: v0_0, nanoseconds: v0_1 } = ret;
  dataView(memory0).setBigInt64(arg0 + 0, toUint64(v0_0), true);
  dataView(memory0).setInt32(arg0 + 8, toUint32(v0_1), true);
}
const lowering14Callee = interface1.writeViaStream;
function lowering14(arg0, arg1, arg2) {
  let ret;
  try {
    ret = { tag: 'ok', val: lowering14Callee(arg0 >>> 0, BigInt.asUintN(64, arg1)) };
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  const variant1 = ret;
  switch (variant1.tag) {
    case 'ok': {
      const e = variant1.val;
      dataView(memory0).setInt8(arg2 + 0, 0, true);
      dataView(memory0).setInt32(arg2 + 4, toUint32(e), true);
      break;
    }
    case 'err': {
      const e = variant1.val;
      dataView(memory0).setInt8(arg2 + 0, 1, true);
      const val0 = e;
      let enum0;
      switch (val0) {
        case 'access': {
          enum0 = 0;
          break;
        }
        case 'would-block': {
          enum0 = 1;
          break;
        }
        case 'already': {
          enum0 = 2;
          break;
        }
        case 'bad-descriptor': {
          enum0 = 3;
          break;
        }
        case 'busy': {
          enum0 = 4;
          break;
        }
        case 'deadlock': {
          enum0 = 5;
          break;
        }
        case 'quota': {
          enum0 = 6;
          break;
        }
        case 'exist': {
          enum0 = 7;
          break;
        }
        case 'file-too-large': {
          enum0 = 8;
          break;
        }
        case 'illegal-byte-sequence': {
          enum0 = 9;
          break;
        }
        case 'in-progress': {
          enum0 = 10;
          break;
        }
        case 'interrupted': {
          enum0 = 11;
          break;
        }
        case 'invalid': {
          enum0 = 12;
          break;
        }
        case 'io': {
          enum0 = 13;
          break;
        }
        case 'is-directory': {
          enum0 = 14;
          break;
        }
        case 'loop': {
          enum0 = 15;
          break;
        }
        case 'too-many-links': {
          enum0 = 16;
          break;
        }
        case 'message-size': {
          enum0 = 17;
          break;
        }
        case 'name-too-long': {
          enum0 = 18;
          break;
        }
        case 'no-device': {
          enum0 = 19;
          break;
        }
        case 'no-entry': {
          enum0 = 20;
          break;
        }
        case 'no-lock': {
          enum0 = 21;
          break;
        }
        case 'insufficient-memory': {
          enum0 = 22;
          break;
        }
        case 'insufficient-space': {
          enum0 = 23;
          break;
        }
        case 'not-directory': {
          enum0 = 24;
          break;
        }
        case 'not-empty': {
          enum0 = 25;
          break;
        }
        case 'not-recoverable': {
          enum0 = 26;
          break;
        }
        case 'unsupported': {
          enum0 = 27;
          break;
        }
        case 'no-tty': {
          enum0 = 28;
          break;
        }
        case 'no-such-device': {
          enum0 = 29;
          break;
        }
        case 'overflow': {
          enum0 = 30;
          break;
        }
        case 'not-permitted': {
          enum0 = 31;
          break;
        }
        case 'pipe': {
          enum0 = 32;
          break;
        }
        case 'read-only': {
          enum0 = 33;
          break;
        }
        case 'invalid-seek': {
          enum0 = 34;
          break;
        }
        case 'text-file-busy': {
          enum0 = 35;
          break;
        }
        case 'cross-device': {
          enum0 = 36;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val0}" is not one of the cases of error-code`);
        }
      }
      dataView(memory0).setInt8(arg2 + 4, enum0, true);
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}
const lowering15Callee = interface1.appendViaStream;
function lowering15(arg0, arg1) {
  let ret;
  try {
    ret = { tag: 'ok', val: lowering15Callee(arg0 >>> 0) };
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  const variant1 = ret;
  switch (variant1.tag) {
    case 'ok': {
      const e = variant1.val;
      dataView(memory0).setInt8(arg1 + 0, 0, true);
      dataView(memory0).setInt32(arg1 + 4, toUint32(e), true);
      break;
    }
    case 'err': {
      const e = variant1.val;
      dataView(memory0).setInt8(arg1 + 0, 1, true);
      const val0 = e;
      let enum0;
      switch (val0) {
        case 'access': {
          enum0 = 0;
          break;
        }
        case 'would-block': {
          enum0 = 1;
          break;
        }
        case 'already': {
          enum0 = 2;
          break;
        }
        case 'bad-descriptor': {
          enum0 = 3;
          break;
        }
        case 'busy': {
          enum0 = 4;
          break;
        }
        case 'deadlock': {
          enum0 = 5;
          break;
        }
        case 'quota': {
          enum0 = 6;
          break;
        }
        case 'exist': {
          enum0 = 7;
          break;
        }
        case 'file-too-large': {
          enum0 = 8;
          break;
        }
        case 'illegal-byte-sequence': {
          enum0 = 9;
          break;
        }
        case 'in-progress': {
          enum0 = 10;
          break;
        }
        case 'interrupted': {
          enum0 = 11;
          break;
        }
        case 'invalid': {
          enum0 = 12;
          break;
        }
        case 'io': {
          enum0 = 13;
          break;
        }
        case 'is-directory': {
          enum0 = 14;
          break;
        }
        case 'loop': {
          enum0 = 15;
          break;
        }
        case 'too-many-links': {
          enum0 = 16;
          break;
        }
        case 'message-size': {
          enum0 = 17;
          break;
        }
        case 'name-too-long': {
          enum0 = 18;
          break;
        }
        case 'no-device': {
          enum0 = 19;
          break;
        }
        case 'no-entry': {
          enum0 = 20;
          break;
        }
        case 'no-lock': {
          enum0 = 21;
          break;
        }
        case 'insufficient-memory': {
          enum0 = 22;
          break;
        }
        case 'insufficient-space': {
          enum0 = 23;
          break;
        }
        case 'not-directory': {
          enum0 = 24;
          break;
        }
        case 'not-empty': {
          enum0 = 25;
          break;
        }
        case 'not-recoverable': {
          enum0 = 26;
          break;
        }
        case 'unsupported': {
          enum0 = 27;
          break;
        }
        case 'no-tty': {
          enum0 = 28;
          break;
        }
        case 'no-such-device': {
          enum0 = 29;
          break;
        }
        case 'overflow': {
          enum0 = 30;
          break;
        }
        case 'not-permitted': {
          enum0 = 31;
          break;
        }
        case 'pipe': {
          enum0 = 32;
          break;
        }
        case 'read-only': {
          enum0 = 33;
          break;
        }
        case 'invalid-seek': {
          enum0 = 34;
          break;
        }
        case 'text-file-busy': {
          enum0 = 35;
          break;
        }
        case 'cross-device': {
          enum0 = 36;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val0}" is not one of the cases of error-code`);
        }
      }
      dataView(memory0).setInt8(arg1 + 4, enum0, true);
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}
const lowering16Callee = interface1.getType;
function lowering16(arg0, arg1) {
  let ret;
  try {
    ret = { tag: 'ok', val: lowering16Callee(arg0 >>> 0) };
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  const variant2 = ret;
  switch (variant2.tag) {
    case 'ok': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg1 + 0, 0, true);
      const val0 = e;
      let enum0;
      switch (val0) {
        case 'unknown': {
          enum0 = 0;
          break;
        }
        case 'block-device': {
          enum0 = 1;
          break;
        }
        case 'character-device': {
          enum0 = 2;
          break;
        }
        case 'directory': {
          enum0 = 3;
          break;
        }
        case 'fifo': {
          enum0 = 4;
          break;
        }
        case 'symbolic-link': {
          enum0 = 5;
          break;
        }
        case 'regular-file': {
          enum0 = 6;
          break;
        }
        case 'socket': {
          enum0 = 7;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val0}" is not one of the cases of descriptor-type`);
        }
      }
      dataView(memory0).setInt8(arg1 + 1, enum0, true);
      break;
    }
    case 'err': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg1 + 0, 1, true);
      const val1 = e;
      let enum1;
      switch (val1) {
        case 'access': {
          enum1 = 0;
          break;
        }
        case 'would-block': {
          enum1 = 1;
          break;
        }
        case 'already': {
          enum1 = 2;
          break;
        }
        case 'bad-descriptor': {
          enum1 = 3;
          break;
        }
        case 'busy': {
          enum1 = 4;
          break;
        }
        case 'deadlock': {
          enum1 = 5;
          break;
        }
        case 'quota': {
          enum1 = 6;
          break;
        }
        case 'exist': {
          enum1 = 7;
          break;
        }
        case 'file-too-large': {
          enum1 = 8;
          break;
        }
        case 'illegal-byte-sequence': {
          enum1 = 9;
          break;
        }
        case 'in-progress': {
          enum1 = 10;
          break;
        }
        case 'interrupted': {
          enum1 = 11;
          break;
        }
        case 'invalid': {
          enum1 = 12;
          break;
        }
        case 'io': {
          enum1 = 13;
          break;
        }
        case 'is-directory': {
          enum1 = 14;
          break;
        }
        case 'loop': {
          enum1 = 15;
          break;
        }
        case 'too-many-links': {
          enum1 = 16;
          break;
        }
        case 'message-size': {
          enum1 = 17;
          break;
        }
        case 'name-too-long': {
          enum1 = 18;
          break;
        }
        case 'no-device': {
          enum1 = 19;
          break;
        }
        case 'no-entry': {
          enum1 = 20;
          break;
        }
        case 'no-lock': {
          enum1 = 21;
          break;
        }
        case 'insufficient-memory': {
          enum1 = 22;
          break;
        }
        case 'insufficient-space': {
          enum1 = 23;
          break;
        }
        case 'not-directory': {
          enum1 = 24;
          break;
        }
        case 'not-empty': {
          enum1 = 25;
          break;
        }
        case 'not-recoverable': {
          enum1 = 26;
          break;
        }
        case 'unsupported': {
          enum1 = 27;
          break;
        }
        case 'no-tty': {
          enum1 = 28;
          break;
        }
        case 'no-such-device': {
          enum1 = 29;
          break;
        }
        case 'overflow': {
          enum1 = 30;
          break;
        }
        case 'not-permitted': {
          enum1 = 31;
          break;
        }
        case 'pipe': {
          enum1 = 32;
          break;
        }
        case 'read-only': {
          enum1 = 33;
          break;
        }
        case 'invalid-seek': {
          enum1 = 34;
          break;
        }
        case 'text-file-busy': {
          enum1 = 35;
          break;
        }
        case 'cross-device': {
          enum1 = 36;
          break;
        }
        default: {
          if ((e) instanceof Error) {
            console.error(e);
          }
          
          throw new TypeError(`"${val1}" is not one of the cases of error-code`);
        }
      }
      dataView(memory0).setInt8(arg1 + 1, enum1, true);
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}
const lowering17Callee = interface17.getEnvironment;
function lowering17(arg0) {
  const ret = lowering17Callee();
  const vec3 = ret;
  const len3 = vec3.length;
  const result3 = realloc0(0, 0, 4, len3 * 16);
  for (let i = 0; i < vec3.length; i++) {
    const e = vec3[i];
    const base = result3 + i * 16;const [tuple0_0, tuple0_1] = e;
    const ptr1 = utf8Encode(tuple0_0, realloc0, memory0);
    const len1 = utf8EncodedLen;
    dataView(memory0).setInt32(base + 4, len1, true);
    dataView(memory0).setInt32(base + 0, ptr1, true);
    const ptr2 = utf8Encode(tuple0_1, realloc0, memory0);
    const len2 = utf8EncodedLen;
    dataView(memory0).setInt32(base + 12, len2, true);
    dataView(memory0).setInt32(base + 8, ptr2, true);
  }
  dataView(memory0).setInt32(arg0 + 4, len3, true);
  dataView(memory0).setInt32(arg0 + 0, result3, true);
}
const lowering18Callee = interface6.write;
function lowering18(arg0, arg1, arg2, arg3) {
  const ptr0 = arg1;
  const len0 = arg2;
  const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
  let ret;
  try {
    ret = { tag: 'ok', val: lowering18Callee(arg0 >>> 0, result0) };
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  const variant2 = ret;
  switch (variant2.tag) {
    case 'ok': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg3 + 0, 0, true);
      dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
      break;
    }
    case 'err': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg3 + 0, 1, true);
      const { } = e;
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}
const lowering19Callee = interface6.blockingWrite;
function lowering19(arg0, arg1, arg2, arg3) {
  const ptr0 = arg1;
  const len0 = arg2;
  const result0 = new Uint8Array(memory0.buffer.slice(ptr0, ptr0 + len0 * 1));
  let ret;
  try {
    ret = { tag: 'ok', val: lowering19Callee(arg0 >>> 0, result0) };
  } catch (e) {
    ret = { tag: 'err', val: getErrorPayload(e) };
  }
  const variant2 = ret;
  switch (variant2.tag) {
    case 'ok': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg3 + 0, 0, true);
      dataView(memory0).setBigInt64(arg3 + 8, toUint64(e), true);
      break;
    }
    case 'err': {
      const e = variant2.val;
      dataView(memory0).setInt8(arg3 + 0, 1, true);
      const { } = e;
      break;
    }
    default: {
      throw new TypeError('invalid variant specified for result');
    }
  }
}
let exports3;
let realloc1;
let postReturn0;
const ipnsPubsubTypes = {
  
};

function publish(arg0, arg1) {
  const ptr0 = utf8Encode(arg0, realloc1, memory0);
  const len0 = utf8EncodedLen;
  const val1 = arg1;
  const len1 = val1.byteLength;
  const ptr1 = realloc1(0, 0, 1, len1 * 1);
  const src1 = new Uint8Array(val1.buffer || val1, val1.byteOffset, len1 * 1);
  (new Uint8Array(memory0.buffer, ptr1, len1 * 1)).set(src1);
  const ret = exports1.publish(ptr0, len0, ptr1, len1);
  let variant5;
  switch (dataView(memory0).getUint8(ret + 0, true)) {
    case 0: {
      const ptr2 = dataView(memory0).getInt32(ret + 4, true);
      const len2 = dataView(memory0).getInt32(ret + 8, true);
      const result2 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr2, len2));
      const ptr3 = dataView(memory0).getInt32(ret + 12, true);
      const len3 = dataView(memory0).getInt32(ret + 16, true);
      const result3 = new Uint8Array(memory0.buffer.slice(ptr3, ptr3 + len3 * 1));
      variant5= {
        tag: 'ok',
        val: {
          topic: result2,
          message: result3,
        }
      };
      break;
    }
    case 1: {
      const ptr4 = dataView(memory0).getInt32(ret + 4, true);
      const len4 = dataView(memory0).getInt32(ret + 8, true);
      const result4 = utf8Decoder.decode(new Uint8Array(memory0.buffer, ptr4, len4));
      variant5= {
        tag: 'err',
        val: result4
      };
      break;
    }
    default: {
      throw new TypeError('invalid variant discriminant for expected');
    }
  }
  postReturn0(ret);
  if (variant5.tag === 'err') {
    throw new ComponentError(variant5.val);
  }
  return variant5.val;
}

function subscribe(arg0) {
  const ptr0 = utf8Encode(arg0, realloc1, memory0);
  const len0 = utf8EncodedLen;
  exports1.subscribe(ptr0, len0);
}

function unsubscribe(arg0) {
  const ptr0 = utf8Encode(arg0, realloc1, memory0);
  const len0 = utf8EncodedLen;
  exports1.unsubscribe(ptr0, len0);
}

export { ipnsPubsubTypes, publish, subscribe, ipnsPubsubTypes as types, unsubscribe }

const $init = (async() => {
  const module0 = fetchCompile(new URL('./ipns_wit.component.core.wasm', import.meta.url));
  const module1 = fetchCompile(new URL('./ipns_wit.component.core2.wasm', import.meta.url));
  const module2 = base64Compile('AGFzbQEAAAABPApgAn9/AGAEf39/fwBgAX8AYAN/fn8AYAJ/fwBgBH9/f38AYAN/fn8Bf2AEf39/fwF/YAJ/fwF/YAF/AAMSEQABAAACAgMEBAIFBQYHCAgJBAUBcAEREQdXEgEwAAABMQABATIAAgEzAAMBNAAEATUABQE2AAYBNwAHATgACAE5AAkCMTAACgIxMQALAjEyAAwCMTMADQIxNAAOAjE1AA8CMTYAEAgkaW1wb3J0cwEACtkBEQsAIAAgAUEAEQAACw8AIAAgASACIANBAREBAAsLACAAIAFBAhEAAAsLACAAIAFBAxEAAAsJACAAQQQRAgALCQAgAEEFEQIACw0AIAAgASACQQYRAwALCwAgACABQQcRBAALCwAgACABQQgRBAALCQAgAEEJEQIACw8AIAAgASACIANBChEFAAsPACAAIAEgAiADQQsRBQALDQAgACABIAJBDBEGAAsPACAAIAEgAiADQQ0RBwALCwAgACABQQ4RCAALCwAgACABQQ8RCAALCQAgAEEQEQkACwAuCXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AQ13aXQtY29tcG9uZW50BjAuMTEuMAClBgRuYW1lABMSd2l0LWNvbXBvbmVudDpzaGltAYgGEQAraW5kaXJlY3QtcGVlcnBpcGVyOmlwbnMtcHVic3ViL2ltcG9ydHMtcHJudAEuaW5kaXJlY3QtcGVlcnBpcGVyOmlwbnMtcHVic3ViL2ltcG9ydHMtcHVibGlzaAIwaW5kaXJlY3QtcGVlcnBpcGVyOmlwbnMtcHVic3ViL2ltcG9ydHMtc3Vic2NyaWJlAzJpbmRpcmVjdC1wZWVycGlwZXI6aXBucy1wdWJzdWIvaW1wb3J0cy11bnN1YnNjcmliZQQvaW5kaXJlY3Qtd2FzaTpjbGktYmFzZS9wcmVvcGVucy1nZXQtZGlyZWN0b3JpZXMFI2luZGlyZWN0LXdhc2k6Y2xvY2tzL3dhbGwtY2xvY2stbm93BjRpbmRpcmVjdC13YXNpOmZpbGVzeXN0ZW0vZmlsZXN5c3RlbS13cml0ZS12aWEtc3RyZWFtBzVpbmRpcmVjdC13YXNpOmZpbGVzeXN0ZW0vZmlsZXN5c3RlbS1hcHBlbmQtdmlhLXN0cmVhbQgsaW5kaXJlY3Qtd2FzaTpmaWxlc3lzdGVtL2ZpbGVzeXN0ZW0tZ2V0LXR5cGUJMmluZGlyZWN0LXdhc2k6Y2xpLWJhc2UvZW52aXJvbm1lbnQtZ2V0LWVudmlyb25tZW50Ch5pbmRpcmVjdC13YXNpOmlvL3N0cmVhbXMtd3JpdGULJ2luZGlyZWN0LXdhc2k6aW8vc3RyZWFtcy1ibG9ja2luZy13cml0ZQwrYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1jbG9ja190aW1lX2dldA0lYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1mZF93cml0ZQ4oYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1lbnZpcm9uX2dldA8uYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1lbnZpcm9uX3NpemVzX2dldBAmYWRhcHQtd2FzaV9zbmFwc2hvdF9wcmV2aWV3MS1wcm9jX2V4aXQ');
  const module3 = base64Compile('AGFzbQEAAAABPApgAn9/AGAEf39/fwBgAX8AYAN/fn8AYAJ/fwBgBH9/f38AYAN/fn8Bf2AEf39/fwF/YAJ/fwF/YAF/AAJsEgABMAAAAAExAAEAATIAAAABMwAAAAE0AAIAATUAAgABNgADAAE3AAQAATgABAABOQACAAIxMAAFAAIxMQAFAAIxMgAGAAIxMwAHAAIxNAAIAAIxNQAIAAIxNgAJAAgkaW1wb3J0cwFwARERCRcBAEEACxEAAQIDBAUGBwgJCgsMDQ4PEAAuCXByb2R1Y2VycwEMcHJvY2Vzc2VkLWJ5AQ13aXQtY29tcG9uZW50BjAuMTEuMAAcBG5hbWUAFRR3aXQtY29tcG9uZW50OmZpeHVwcw');
  Promise.all([module0, module1, module2, module3]).catch(() => {});
  ({ exports: exports0 } = await instantiateCore(await module2));
  ({ exports: exports1 } = await instantiateCore(await module0, {
    'peerpiper:ipns-pubsub/imports': {
      prnt: exports0['0'],
      publish: exports0['1'],
      subscribe: exports0['2'],
      unsubscribe: exports0['3'],
    },
    wasi_snapshot_preview1: {
      clock_time_get: exports0['12'],
      environ_get: exports0['14'],
      environ_sizes_get: exports0['15'],
      fd_write: exports0['13'],
      proc_exit: exports0['16'],
    },
  }));
  ({ exports: exports2 } = await instantiateCore(await module1, {
    __main_module__: {
      cabi_realloc: exports1.cabi_realloc,
    },
    env: {
      memory: exports1.memory,
    },
    'wasi:cli-base/environment': {
      'get-environment': exports0['9'],
    },
    'wasi:cli-base/exit': {
      exit: lowering2,
    },
    'wasi:cli-base/preopens': {
      'get-directories': exports0['4'],
    },
    'wasi:cli-base/stderr': {
      'get-stderr': lowering5,
    },
    'wasi:cli-base/stdin': {
      'get-stdin': lowering3,
    },
    'wasi:cli-base/stdout': {
      'get-stdout': lowering4,
    },
    'wasi:clocks/monotonic-clock': {
      now: lowering0,
    },
    'wasi:clocks/wall-clock': {
      now: exports0['5'],
    },
    'wasi:filesystem/filesystem': {
      'append-via-stream': exports0['7'],
      'drop-descriptor': lowering1,
      'get-type': exports0['8'],
      'write-via-stream': exports0['6'],
    },
    'wasi:io/streams': {
      'blocking-write': exports0['11'],
      'drop-input-stream': lowering6,
      'drop-output-stream': lowering7,
      write: exports0['10'],
    },
  }));
  memory0 = exports1.memory;
  realloc0 = exports2.cabi_import_realloc;
  ({ exports: exports3 } = await instantiateCore(await module3, {
    '': {
      $imports: exports0.$imports,
      '0': lowering8,
      '1': lowering9,
      '10': lowering18,
      '11': lowering19,
      '12': exports2.clock_time_get,
      '13': exports2.fd_write,
      '14': exports2.environ_get,
      '15': exports2.environ_sizes_get,
      '16': exports2.proc_exit,
      '2': lowering10,
      '3': lowering11,
      '4': lowering12,
      '5': lowering13,
      '6': lowering14,
      '7': lowering15,
      '8': lowering16,
      '9': lowering17,
    },
  }));
  realloc1 = exports1.cabi_realloc;
  postReturn0 = exports1.cabi_post_publish;
})();

await $init;
