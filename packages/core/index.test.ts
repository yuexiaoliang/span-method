import { expect, it, describe } from 'vitest';
import { findItemById, findColByKey, createTable } from '@span-method/mock';
import { calcColSpan, calcRowSpan, calcTableSpan, getCellSpanByTableSpan } from './index';

describe('Testing calcColSpan.', () => {
  it('normal.', () => {
    expect(calcColSpan(findItemById('ID384'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1]);

    expect(calcColSpan(findItemById('ID023'))).toEqual([1, 1, 1, 4, 0, 0, 0, 1]);
  });

  it('the row data type is incorrect.', () => {
    // @ts-ignore
    expect(() => calcColSpan([])).toThrow('calcColSpan: col must be an object');

    // @ts-ignore
    expect(() => calcColSpan(null)).toThrow('calcColSpan: col must be an object');

    // @ts-ignore
    expect(() => calcColSpan(1)).toThrow('calcColSpan: col must be an object');
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

  it('the col data type is incorrect.', () => {
    // @ts-ignore
    expect(() => calcRowSpan({})).toThrow('calcRowSpan: data must be an array');

    // @ts-ignore
    expect(() => calcRowSpan(null)).toThrow('calcRowSpan: data must be an array');

    // @ts-ignore
    expect(() => calcRowSpan(1)).toThrow('calcRowSpan: data must be an array');
  });

  it('the col data field type is incorrect.', () => {
    expect(calcRowSpan(findColByKey('discount'))).toEqual([2, 0, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);

    expect(calcRowSpan(findColByKey('payment'))).toEqual([1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
  });
});

describe('Testing calcTableSpan.', () => {
  it('normal.', () => {
    const table = createTable(4, 4);
    const { rowsSpan, colsSpan } = calcTableSpan(table);

    expect(rowsSpan).toEqual([
      [1, 1, 1, 1],
      [1, 3, 0, 0],
      [1, 3, 0, 0],
      [1, 1, 2, 0]
    ]);

    expect(colsSpan).toEqual([
      [1, 1, 2, 0],
      [1, 1, 1, 1],
      [1, 1, 2, 0],
      [1, 1, 2, 0]
    ]);
  });

  it('the table data type is incorrect.', () => {
    // @ts-ignore
    expect(() => calcTableSpan({})).toThrow('calcTableSpan: table must be an array');

    // @ts-ignore
    expect(() => calcTableSpan(null)).toThrow('calcTableSpan: table must be an array');

    // @ts-ignore
    expect(() => calcTableSpan(1)).toThrow('calcTableSpan: table must be an array');
  });
});

describe('Testing getCellSpanByTableSpan', () => {
  it('normal.', () => {
    const table = createTable(4, 4);
    console.log(`🚀 > file: index.test.ts:88 > it > table:`, table);
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
