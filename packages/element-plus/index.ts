import { getCellSpanByTableSpan, calcTableSpan } from '@span-method/core';
import type { TableInstance } from 'element-plus';
import type { Table, Options } from '@span-method/core';

export type SpanMethod = TableInstance['spanMethod'];
export type DefineSpanMethod = (data: Table, options?: Options) => SpanMethod;

export type { Options, Table };

const defineSpanMethod: DefineSpanMethod = (data: Table, options?: Options) => {
  const tableSpan = calcTableSpan(data, options);

  return ({ rowIndex, columnIndex }) => {
    const [rowSpan, colSpan] = getCellSpanByTableSpan(tableSpan, rowIndex, columnIndex);
    return { rowspan: rowSpan, colspan: colSpan };
  };
};

export default defineSpanMethod;
