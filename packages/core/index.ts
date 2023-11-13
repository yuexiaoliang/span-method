import { notNum, notStr, notBool, notObj } from '@span-method/utils';

export type Row = Record<string, unknown>;

// function used for calculating the colSpan of a row
export const calcColSpan = (row: Row) => {
  if (notObj(row)) {
    throw new Error('calcColSpan: col must be an object');
  }

  const values = Object.values(row);
  const result = [];

  let spanCellIndex = 0;
  let prev = values[0];
  let len = values.length;

  for (let i = 0; i < len; i++) {
    if (i === 0) {
      result.push(1);
      continue;
    }

    let val = values[i];

    if (isDiff(val, prev)) {
      result.push(1);
      spanCellIndex = i;
    } else {
      result.push(0);
      result[spanCellIndex] += 1;
    }

    prev = val;
  }

  return result;
};

// Checks if the value is a primitive and if it is different from the previous value
const isDiff = (val: unknown, prev: unknown) => {
  return (notStr(val) && notNum(val) && notBool(val)) || val !== prev;
};
