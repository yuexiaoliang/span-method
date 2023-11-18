import { expect, it, describe, beforeEach } from 'vitest';
import { findItemById, findColByKey, createTable } from '@span-method/mock';
import { createConsoleWarnSpy, createAllDataTypesData } from '@span-method/test-utils';
import { getType } from '@span-method/utils';
import SpanMethod from './index';
import type { Options } from './index';
import { WARNING_MESSAGES } from './constants';

describe('Testing calcColSpan.', () => {
  let spanMethod: SpanMethod;

  beforeEach(() => {
    spanMethod = new SpanMethod(createTable(4, 4));
  });

  it('Normal.', () => {
    expect(spanMethod.calcColSpan(findItemById('ID384'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1]);

    expect(spanMethod.calcColSpan(findItemById('ID023'))).toEqual([1, 1, 1, 4, 0, 0, 0, 1]);
  });

  it('Row data field type is incorrect.', () => {
    expect(spanMethod.calcColSpan(findItemById('ID064'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1]);
  });
});

describe('Testing calcRowSpan.', () => {
  let spanMethod: SpanMethod;

  beforeEach(() => {
    spanMethod = new SpanMethod(createTable(4, 4));
  });

  it('Normal.', () => {
    expect(spanMethod.calcRowSpan(findColByKey('name'))).toEqual([1, 3, 0, 0, 2, 0, 1, 1, 1, 1, 1, 1]);

    expect(spanMethod.calcRowSpan(findColByKey('c_price'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('Col data field type is incorrect.', () => {
    expect(spanMethod.calcRowSpan(findColByKey('discount'))).toEqual([2, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(spanMethod.calcRowSpan(findColByKey('payment'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
});

describe('Testing calcRowsSpan.', () => {
  createAllDataTypesData(['object']).forEach((data) => {
    it(`Rows data type is ${getType(data)}.`, () => {
      const consoleWarnSpy = createConsoleWarnSpy();

      // @ts-ignore
      const spanMethod = new SpanMethod([data]);
      const rowsSpan = spanMethod.calcRowsSpan();
      expect(rowsSpan).toEqual([]);

      expect(consoleWarnSpy).toHaveBeenCalledWith(WARNING_MESSAGES.ROW_TYPE_ERROR);
    });
  });
});

describe('Testing calcTableSpan.', () => {
  const table = createTable(4, 4);

  const validRowsSpan = [
    [1, 1, 1, 1],
    [1, 3, 0, 0],
    [1, 3, 0, 0],
    [1, 1, 2, 0]
  ];

  const validColsSpan = [
    [1, 1, 2, 0],
    [1, 1, 1, 1],
    [1, 1, 2, 0],
    [1, 1, 2, 0]
  ];

  it('Normal.', () => {
    const {
      tableSpan: { rowsSpan, colsSpan }
    } = new SpanMethod(table);

    expect(rowsSpan).toEqual(validRowsSpan);
    expect(colsSpan).toEqual(validColsSpan);
  });

  ['both', { mode: 'both' }].forEach((option) => {
    it(`Options is ${JSON.stringify(option)}.`, () => {
      const {
        tableSpan: { rowsSpan, colsSpan }
      } = new SpanMethod(table, option as Options);
      expect(rowsSpan).toEqual(validRowsSpan);
      expect(colsSpan).toEqual(validColsSpan);
    });
  });

  ['row', { mode: 'row' }].forEach((option) => {
    it(`Options is ${JSON.stringify(option)}.`, () => {
      const {
        tableSpan: { rowsSpan, colsSpan }
      } = new SpanMethod(table, option as Options);

      expect(rowsSpan).toEqual(validRowsSpan);
      expect(colsSpan).toEqual([]);
    });
  });

  ['col', { mode: 'col' }].forEach((option) => {
    it(`Options is ${JSON.stringify(option)}.`, () => {
      const {
        tableSpan: { rowsSpan, colsSpan }
      } = new SpanMethod(table, option as Options);

      expect(rowsSpan).toEqual([]);
      expect(colsSpan).toEqual(validColsSpan);
    });
  });

  ['test', { mode: 'test' }].forEach((option) => {
    it(`Options is ${JSON.stringify(option)}.`, () => {
      const consoleWarnSpy = createConsoleWarnSpy();

      const {
        tableSpan: { rowsSpan, colsSpan }
      } = new SpanMethod(table, option as Options);

      expect(rowsSpan).toEqual([]);
      expect(colsSpan).toEqual([]);

      expect(consoleWarnSpy).toHaveBeenCalledWith(WARNING_MESSAGES.MODE_ERROR);
    });
  });

  createAllDataTypesData(['array']).forEach((data) => {
    it(`Table data type is ${getType(data)}.`, () => {
      const consoleWarnSpy = createConsoleWarnSpy();

      // @ts-ignore
      const { tableSpan } = new SpanMethod(data);
      expect(tableSpan).toEqual({ rowsSpan: [], colsSpan: [] });

      expect(consoleWarnSpy).toHaveBeenCalledWith(WARNING_MESSAGES.TABLE_TYPE_ERROR);
    });
  });
});

describe('Testing getCellSpanByTableSpan', () => {
  it('Normal.', () => {
    const table = createTable(4, 4);
    const spanMethod = new SpanMethod(table);

    expect(spanMethod.getCellSpanByTableSpan(0, 0)).toEqual([1, 1]);
    expect(spanMethod.getCellSpanByTableSpan(1, 1)).toEqual([3, 1]);
    expect(spanMethod.getCellSpanByTableSpan(1, 2)).toEqual([3, 1]);
    expect(spanMethod.getCellSpanByTableSpan(1, 3)).toEqual([1, 1]);
    expect(spanMethod.getCellSpanByTableSpan(2, 1)).toEqual([0, 1]);
    expect(spanMethod.getCellSpanByTableSpan(2, 2)).toEqual([0, 2]);
    expect(spanMethod.getCellSpanByTableSpan(2, 3)).toEqual([2, 0]);
  });
});
