import { ReactNode } from 'react';

export type T_ItemTypeBase = {
  _id: string;
  key: string;
};

export type T_ColumnData<Item extends T_ItemTypeBase> = {
  title: string;
  dataIndex: keyof Item;
  key: string;
  render?: (text: string, item: Item) => ReactNode | ReactNode[];
};
