import { notArr, notObj, isDiff, isStr, isObj } from '@span-method/utils';
import { WARNING_MESSAGES } from './constants';

export type UnknownArray = unknown[];
export type Table = Row[];
export interface TableSpan {
  rowsSpan: RowsSpan;
  colsSpan: ColsSpan;
}
export type Row = Record<string, unknown>;
export type RowsSpan = ReturnType<SpanMethod['calcRowsSpan']>;
export type RowSpan = ReturnType<SpanMethod['calcRowSpan']>;
export type Col = UnknownArray;
export type ColSpan = ReturnType<SpanMethod['calcColSpan']>;
export type ColsSpan = ReturnType<SpanMethod['calcColsSpan']>;
export type CelSpan = [rowSpan: number, colSpan: number];

type Pattern = string | string[];
export type Mode = 'row' | 'col' | 'both';
export interface OptionsInterface {
  mode?: Mode;
  include?: Pattern;
  exclude?: Pattern;
}
export type Options = Mode | OptionsInterface;

class SpanMethod {
  table: Table;
  options?: Options;

  tableSpan: TableSpan = { rowsSpan: [], colsSpan: [] };

  constructor(table: Table, options?: Options) {
    this.table = table;
    this.options = options;

    this.calcTableSpan();
  }

  getCellSpanByTableSpan(rowIndex: number, colIndex: number): CelSpan {
    const { rowsSpan, colsSpan } = this.tableSpan;

    const rowSpan = rowsSpan?.[colIndex]?.[rowIndex] ?? 1;
    const colSpan = colsSpan?.[rowIndex]?.[colIndex] ?? 1;

    return [rowSpan, colSpan];
  }

  calcTableSpan() {
    if (notArr(this.table)) {
      console.warn(WARNING_MESSAGES.TABLE_TYPE_ERROR);
      return { rowsSpan: [], colsSpan: [] };
    }

    let _mode: Mode = 'both';
    let rowsSpan: RowsSpan = [];
    let colsSpan: ColsSpan = [];

    if (isStr(this.options)) {
      _mode = this.options;
    }

    if (isObj(this.options)) {
      const { mode } = this.options;
      if (mode) _mode = mode;
    }

    switch (_mode) {
      case 'row':
        rowsSpan = this.calcRowsSpan();
        break;

      case 'col':
        colsSpan = this.calcColsSpan();
        break;

      case 'both':
        rowsSpan = this.calcRowsSpan();
        colsSpan = this.calcColsSpan();
        break;

      default:
        console.warn(WARNING_MESSAGES.MODE_ERROR);
    }

    this.tableSpan = { rowsSpan, colsSpan };
  }

  calcColsSpan() {
    if (notArr(this.table)) return [];

    return this.table.map((item) => this.calcColSpan(item));
  }

  calcRowsSpan() {
    if (notArr(this.table) || !this.table.length) return [];

    const firstRow = this.table?.[0];
    if (notObj(firstRow)) {
      console.warn(WARNING_MESSAGES.ROW_TYPE_ERROR);
      return [];
    }

    const keys = Object.keys(firstRow);

    return keys.map((key) => {
      const col = this.table.map((row) => row[key]);
      return this.calcRowSpan(col);
    });
  }

  calcColSpan(row: Row) {
    if (notObj(row)) return [];

    return this.calcSpan(Object.values(row));
  }

  calcRowSpan(col: Col) {
    return this.calcSpan(col);
  }

  calcSpan(data: UnknownArray): number[] {
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
  }
}

export default SpanMethod;
