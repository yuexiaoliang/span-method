// transform string to camel case
export function toHump(name: string) {
  return name.replace(/\-(\w)/g, (_, letter) => {
    return letter.toUpperCase();
  });
}

export function getType(val: any) {
  return Object.prototype.toString.call(val).slice(8, -1);
}

export function isStr(val: any) {
  return typeof val === 'string';
}

export function notStr(val: any) {
  return !isStr(val);
}

export function isNum(val: any) {
  return typeof val === 'number';
}

export function notNum(val: any) {
  return !isNum(val);
}

export function isBool(val: any) {
  return typeof val === 'boolean';
}

export function notBool(val: any) {
  return !isBool(val);
}

export function isObj(val: any) {
  return getType(val) === 'Object';
}

export function notObj(val: any) {
  return !isObj(val);
}

export function isArr(val: any) {
  return getType(val) === 'Array';
}

export function notArr(val: any) {
  return !isArr(val);
}

export function isPrimitive(val: any) {
  return isStr(val) || isNum(val) || isBool(val);
}

export function notPrimitive(val: any) {
  return !isPrimitive(val);
}