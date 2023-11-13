import { expect, it, describe } from 'vitest';
import { findItemById } from '@span-method/mock';
import { calcColSpan } from './index';

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
