import { getCellSpanByTableSpan, calcTableSpan } from '@span-method/core';
import type { TableInstance } from 'element-plus';
import type { Table, Options } from '@span-method/core';

export type { Options };

type DefineSpanMethod = (data: Table, options?: Options) => TableInstance['spanMethod'];

const defineSpanMethod: DefineSpanMethod = (data: Table, options?: Options) => {
  const tableSpan = calcTableSpan(data, options);

  return ({ rowIndex, columnIndex }) => {
    const [rowSpan, colSpan] = getCellSpanByTableSpan(tableSpan, rowIndex, columnIndex);
    return { rowspan: rowSpan, colspan: colSpan };

    switch (options) {
      case 'row':
        return { rowspan: rowSpan, colspan: 1 };

      case 'col':
        return { rowspan: 1, colspan: colSpan };

      default:
        return { rowspan: rowSpan, colspan: colSpan };
    }
  };
};

export default defineSpanMethod;
