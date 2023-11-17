import { vi, afterEach } from 'vitest';

export function createConsoleWarnSpy() {
  const consoleWarnSpy = vi.spyOn(console, 'warn');

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  return consoleWarnSpy;
}

/**
 * 创建某些数据类型的数据，用于测试
 * @param exclude 用于排除某些数据类型
 * @returns
 */
export function createAllDataTypesData(exclude?: string[]) {
  const data = {
    undefined: undefined,
    null: null,
    boolean: true,
    number: 1,
    string: 'string',
    symbol: Symbol(),
    function: () => {},
    array: [],
    object: {},
    date: new Date(),
    regexp: /regexp/,
  };

  if (exclude) {
    exclude.forEach((key) => {
      const _key = key.toLowerCase();
      // @ts-ignore
      if (data[_key]) delete data[key.toLowerCase()];
    });
  }

  return Object.values(data);
}
