import { expect, it, describe } from 'vitest';
import { findItemById, findColByKey, createTable } from '@span-method/mock';
import { createConsoleWarnSpy, createAllDataTypesData } from '@span-method/test-utils';
import { getType } from '@span-method/utils';
import { Options, calcColSpan, calcRowSpan, calcRowsSpan, calcTableSpan, getCellSpanByTableSpan } from './index';
import { WARNING_MESSAGES } from './constants';

describe('Testing calcColSpan.', () => {
  it('normal.', () => {
    expect(calcColSpan(findItemById('ID384'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1]);

    expect(calcColSpan(findItemById('ID023'))).toEqual([1, 1, 1, 4, 0, 0, 0, 1]);
  });

  it('the row data field type is incorrect.', () => {
    expect(calcColSpan(findItemById('ID064'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1]);
  });
});

describe('Testing calcRowSpan.', () => {
  it('.normal.', () => {
    expect(calcRowSpan(findColByKey('name'))).toEqual([1, 3, 0, 0, 2, 0, 1, 1, 1, 1, 1, 1]);

    expect(calcRowSpan(findColByKey('c_price'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
  });

  it('the col data field type is incorrect.', () => {
    expect(calcRowSpan(findColByKey('discount'))).toEqual([2, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
    expect(calcRowSpan(findColByKey('payment'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
});

describe('Testing calcRowsSpan.', () => {
  createAllDataTypesData(['object']).forEach((data) => {
    it(`the rows data type is ${getType(data)}.`, () => {
      const consoleWarnSpy = createConsoleWarnSpy();

      // @ts-ignore
      const rowsSpan = calcRowsSpan([data]);

      expect(consoleWarnSpy).toHaveBeenCalledWith(WARNING_MESSAGES.ROW_TYPE_ERROR);

      expect(rowsSpan).toEqual([]);
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

  it('normal.', () => {
    const { rowsSpan, colsSpan } = calcTableSpan(table);
    expect(rowsSpan).toEqual(validRowsSpan);
    expect(colsSpan).toEqual(validColsSpan);
  });

  ['both', { mode: 'both' }].forEach((option) => {
    it(`options is ${JSON.stringify(option)}.`, () => {
      const { rowsSpan, colsSpan } = calcTableSpan(table, option as Options);
      expect(rowsSpan).toEqual(validRowsSpan);
      expect(colsSpan).toEqual(validColsSpan);
    });
  });

  ['row', { mode: 'row' }].forEach((option) => {
    it(`options is ${JSON.stringify(option)}.`, () => {
      const { rowsSpan, colsSpan } = calcTableSpan(table, option as Options);
      expect(rowsSpan).toEqual(validRowsSpan);
      expect(colsSpan).toEqual([]);
    });
  });

  ['col', { mode: 'col' }].forEach((option) => {
    it(`options is ${JSON.stringify(option)}.`, () => {
      const { rowsSpan, colsSpan } = calcTableSpan(table, option as Options);
      expect(rowsSpan).toEqual([]);
      expect(colsSpan).toEqual(validColsSpan);
    });
  });

  ['test', { mode: 'test' }].forEach((option) => {
    it(`options is ${JSON.stringify(option)}.`, () => {
      const consoleWarnSpy = createConsoleWarnSpy();

      // @ts-ignore
      const { rowsSpan, colsSpan } = calcTableSpan(table, option);

      expect(consoleWarnSpy).toHaveBeenCalledWith(WARNING_MESSAGES.MODE_ERROR);

      expect(rowsSpan).toEqual([]);
      expect(colsSpan).toEqual([]);
    });
  });

  createAllDataTypesData(['array']).forEach((data) => {
    it(`the table data type is ${getType(data)}.`, () => {
      const consoleWarnSpy = createConsoleWarnSpy();

      // @ts-ignore
      const tableSpan = calcTableSpan(data);

      expect(consoleWarnSpy).toHaveBeenCalledWith(WARNING_MESSAGES.TABLE_TYPE_ERROR);

      expect(tableSpan).toEqual({ rowsSpan: [], colsSpan: [] });
    });
  });
});

describe('Testing getCellSpanByTableSpan', () => {
  it('normal.', () => {
    const table = createTable(4, 4);
    const tableSpan = calcTableSpan(table);

    expect(getCellSpanByTableSpan(tableSpan, 0, 0)).toEqual([1, 1]);
    expect(getCellSpanByTableSpan(tableSpan, 1, 1)).toEqual([3, 1]);
    expect(getCellSpanByTableSpan(tableSpan, 1, 2)).toEqual([3, 1]);
    expect(getCellSpanByTableSpan(tableSpan, 1, 3)).toEqual([1, 1]);
    expect(getCellSpanByTableSpan(tableSpan, 2, 1)).toEqual([0, 1]);
    expect(getCellSpanByTableSpan(tableSpan, 2, 2)).toEqual([0, 2]);
    expect(getCellSpanByTableSpan(tableSpan, 2, 3)).toEqual([2, 0]);
  });
});
