export const data = [
  { id: 'ID384', name: 'PA', price: 100, c_price: 100, discount: 20, payment: 60, freight: 10, city: 'Shanghai' },
  { id: 'ID825', name: 'PO', price: 300, c_price: 280, discount: 20, payment: 280, freight: 8, city: 'Guangzhou' },
  { id: 'ID027', name: 'PO', price: 300, c_price: 300, discount: 0, payment: 300, freight: 12, city: 'Shanghai' },
  { id: 'ID923', name: 'PO', price: 300, c_price: 300, discount: 0, payment: 300, freight: 10, city: 'Beijing' },
  { id: 'ID043', name: 'PC', price: 150, c_price: 120, discount: 10, payment: 110, freight: 12, city: 'Shanghai' },
  { id: 'ID023', name: 'PC', price: 120, c_price: 60, discount: 60, payment: 60, freight: 60, city: 'Shanghai' },
  { id: 'ID138', name: 'PD', price: 80, c_price: 70, discount: 5, payment: 65, freight: 8, city: 'Shanghai' },
  { id: 'ID032', name: 'PE', price: 300, c_price: 280, discount: 20, payment: 260, freight: 10, city: 'Beijing' },
  { id: 'ID293', name: 'PF', price: 200, c_price: 180, discount: 0, payment: 180, freight: 15, city: 'Guangzhou' },
  { id: 'ID983', name: 'PG', price: 120, c_price: 100, discount: 10, payment: 90, freight: 8, city: 'Shanghai' },
  { id: 'ID083', name: 'PH', price: 250, c_price: 230, discount: 0, payment: 230, freight: 12, city: 'Beijing' },
  { id: 'ID064', name: 'PE', price: 200, c_price: 200, discount: null, payment: {}, freight: [], city: function () {} }
];

export type Item = (typeof data)[number];

export type Keys = keyof Item;

export const findItemById = (id: string) => data.find((item) => item.id === id) as Item;

export const findColByKey = (key: Keys) => data.map((item) => item[key]);

export const createTable = (rowNumber: number, colNumber: number) => {
  const table = [];

  for (let i = 0; i < rowNumber; i++) {
    const oldRow = data[i] || [];
    const row = {};

    const keys = Object.keys(oldRow);

    for (let j = 0; j < colNumber; j++) {
      const key = keys[j];

      // @ts-ignore
      row[key] = oldRow[key];
    }

    table.push(row);
  }

  return table;
};
