import SpanMethod from '@span-method/core';
import type { TableInstance } from 'element-plus';
import type { Table, Options } from '@span-method/core';

export type ElementPlusSpanMethodProp = TableInstance['spanMethod'];
export type DefineSpanMethod = (data: Table, options?: Options) => ElementPlusSpanMethodProp;

export type { Options, Table };

const defineSpanMethod: DefineSpanMethod = (data: Table, options?: Options) => {
  const spanMethod = new SpanMethod(data, options);

  return ({ rowIndex, columnIndex }) => {
    const [rowSpan, colSpan] = spanMethod.getCellSpanByTableSpan( rowIndex, columnIndex);
    return { rowspan: rowSpan, colspan: colSpan };
  };
};

export default defineSpanMethod;
