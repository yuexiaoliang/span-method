import { getCellSpanByTableSpan, calcTableSpan } from '@span-method/core';
import type { TableInstance } from 'element-plus';
import type { Table } from '@span-method/core';

export type Model = 'row' | 'col';

type DefineSpanMethod = (data: Table, model?: Model) => TableInstance['spanMethod'];

const defineSpanMethod: DefineSpanMethod = (data: Table, model?: Model) => {
  const tableSpan = calcTableSpan(data);

  return ({ rowIndex, columnIndex }) => {
    const [rowSpan, colSpan] = getCellSpanByTableSpan(tableSpan, rowIndex, columnIndex);

    switch (model) {
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
