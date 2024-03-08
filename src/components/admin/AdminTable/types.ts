import { ReactNode } from 'react';

export type ItemTypeBase = {
  _id: string;
  key: string;
};

export type ColumnData<Item extends ItemTypeBase> = {
  title: string;
  dataIndex: keyof Item;
  key: string;
  render?: (text: string, item: Item) => ReactNode | ReactNode[];
};
