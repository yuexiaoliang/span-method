import { notArr, notObj, notPrimitive } from '@span-method/utils';

export type Table = Row[];
export type TableSpan = ReturnType<typeof calcTableSpan>;
export type Col = unknown[];
export type ColSpan = ReturnType<typeof calcColSpan>;
export type ColsSpan = ReturnType<typeof calcColsSpan>;
export type Row = Record<string, unknown>;
export type RowsSpan = ReturnType<typeof calcRowsSpan>;
export type RowSpan = ReturnType<typeof calcRowSpan>;
export type CelSpan = [rowSpan: number, colSpan: number];

export const getCellSpanByTableSpan = (tableSpan: TableSpan, rowIndex: number, colIndex: number): CelSpan => {
  const { rowsSpan, colsSpan } = tableSpan;

  const rowSpan = rowsSpan?.[colIndex]?.[rowIndex] ?? 1;
  const colSpan = colsSpan?.[rowIndex]?.[colIndex] ?? 1;

  return [rowSpan, colSpan];
};

export const calcTableSpan = (table: Table) => {
  if (notArr(table)) {
    throw new Error('calcTableSpan: table must be an array');
  }

  const rowsSpan = calcRowsSpan(table);
  const colsSpan = calcColsSpan(table);

  return { rowsSpan, colsSpan };
};

export const calcRowsSpan = (table: Table) => {
  return table[0] ? Object.keys(table[0]).map((key) => calcRowSpan(table.map((row) => row[key]))) : [];
};

export const calcColsSpan = (table: Table) => {
  return table.map(calcColSpan);
};

// function used for calculating the colSpan of a row
export const calcColSpan = (row: Row) => {
  if (notObj(row)) {
    throw new Error('calcColSpan: col must be an object');
  }

  return calcSpan(Object.values(row));
};

// function used for calculating the rowSpan of a column
export const calcRowSpan = (col: Col) => {
  if (notArr(col)) {
    throw new Error('calcRowSpan: data must be an array');
  }

  return calcSpan(col);
};

// function used for calculating the span of a array
const calcSpan = (arr: unknown[]) => {
  const result = [];
  const len = arr.length;

  let spanCellIndex = 0;
  let prev = arr[0];

  for (let i = 0; i < len; i++) {
    if (i === 0) {
      result.push(1);
      continue;
    }

    const val = arr[i];

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
  return notPrimitive(val) || val !== prev;
};
