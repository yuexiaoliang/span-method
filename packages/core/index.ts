import { notArr, notObj, isDiff, isStr, isObj } from '@span-method/utils';
import { WARNING_MESSAGES } from './constants';

export type UnknownArray = unknown[];
export type Table = Row[];
export type TableSpan = ReturnType<typeof calcTableSpan>;
export type Row = Record<string, unknown>;
export type RowsSpan = ReturnType<typeof calcRowsSpan>;
export type RowSpan = ReturnType<typeof calcRowSpan>;
export type Col = UnknownArray;
export type ColSpan = ReturnType<typeof calcColSpan>;
export type ColsSpan = ReturnType<typeof calcColsSpan>;
export type CelSpan = [rowSpan: number, colSpan: number];

type Pattern = string | string[];
export type Mode = 'row' | 'col' | 'both';
export interface OptionsInterface {
  mode?: Mode;
  include?: Pattern;
  exclude?: Pattern;
}
export type Options = Mode | OptionsInterface;

export const getCellSpanByTableSpan = (tableSpan: TableSpan, rowIndex: number, colIndex: number): CelSpan => {
  const { rowsSpan, colsSpan } = tableSpan;

  const rowSpan = rowsSpan?.[colIndex]?.[rowIndex] ?? 1;
  const colSpan = colsSpan?.[rowIndex]?.[colIndex] ?? 1;

  return [rowSpan, colSpan];
};

export const calcTableSpan = (table: Table, options?: Options) => {
  if (notArr(table)) {
    console.warn(WARNING_MESSAGES.TABLE_TYPE_ERROR);
    return { rowsSpan: [], colsSpan: [] };
  }

  let _mode: Mode = 'both';
  let rowsSpan: RowsSpan = [];
  let colsSpan: ColsSpan = [];

  if (isStr(options)) {
    _mode = options;
  }

  if (isObj(options)) {
    const { mode } = options;
    if (mode) _mode = mode;
  }

  switch (_mode) {
    case 'row':
      rowsSpan = calcRowsSpan(table);
      break;

    case 'col':
      colsSpan = calcColsSpan(table);
      break;

    case 'both':
      rowsSpan = calcRowsSpan(table);
      colsSpan = calcColsSpan(table);
      break;

    default:
      console.warn(WARNING_MESSAGES.MODE_ERROR);
  }

  return { rowsSpan, colsSpan };
};

export const calcRowsSpan = (table: Table) => {
  if (notArr(table) || !table.length) return [];

  const firstRow = table?.[0];
  if (notObj(firstRow)) {
    console.warn(WARNING_MESSAGES.ROW_TYPE_ERROR)
    return []
  };

  const keys = Object.keys(firstRow);

  const rowsSpan = keys.map((key) => {
    const col = table.map((row) => row[key]);
    return calcRowSpan(col);
  });

  return rowsSpan;
};

export const calcColsSpan = (table: Table) => {
  if (notArr(table)) return [];

  return table.map(calcColSpan);
};

// function used for calculating the colSpan of a row
export const calcColSpan = (row: Row) => {
  return calcSpan(Object.values(row));
};

// function used for calculating the rowSpan of a column
export const calcRowSpan = (col: Col) => {
  return calcSpan(col);
};

// function used for calculating the span of a array
const calcSpan = (data: UnknownArray) => {
  if (notArr(data)) return [];

  const result = [];
  const len = data.length;

  let spanCellIndex = 0;
  let prev = data[0];

  for (let i = 0; i < len; i++) {
    if (i === 0) {
      result.push(1);
      continue;
    }

    const val = data[i];

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
