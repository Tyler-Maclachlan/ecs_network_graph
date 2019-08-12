export function deepExtend(
  a: any,
  b: any,
  protoExtend: boolean = false,
  allowDeletion: boolean = false
) {
  for (const prop in b) {
    if (Object.prototype.hasOwnProperty.call(b, prop) || protoExtend === true) {
      if (b[prop] && Object.getPrototypeOf(b[prop]) === Object.prototype) {
        if (a[prop] === undefined) {
          a[prop] = deepExtend({}, b[prop], protoExtend); // NOTE: allowDeletion not propagated!
        } else if (
          a[prop] &&
          Object.getPrototypeOf(a[prop]) === Object.prototype
        ) {
          deepExtend(a[prop], b[prop], protoExtend); // NOTE: allowDeletion not propagated!
        } else {
          copyOrDelete(a, b, prop, allowDeletion);
        }
      } else if (Array.isArray(b[prop])) {
        a[prop] = b[prop].slice();
      } else {
        copyOrDelete(a, b, prop, allowDeletion);
      }
    }
  }
  return a;
}

function copyOrDelete(
  a: any,
  b: any,
  prop: string,
  allowDeletion: boolean
): void {
  let doDeletion = false;
  if (allowDeletion === true) {
    doDeletion = b[prop] === null && a[prop] !== undefined;
  }

  if (doDeletion) {
    delete a[prop];
  } else {
    a[prop] = b[prop]; // Remember, this is a reference copy!
  }
}
