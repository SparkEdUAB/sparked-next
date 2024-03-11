import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TschoolFields } from './types';
import { ColumnData } from '@components/admin/AdminTable/types';

export const schoolTableColumns: ColumnData<TschoolFields>[] = [
  {
    title: '#',
    dataIndex: 'index' as keyof TschoolFields,
    key: 'index',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Create By',
    dataIndex: 'created_by',
    key: 'created_by',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Create At',
    dataIndex: 'created_at',
    key: 'created_by',
    render: (text) => <a>{text}</a>,
  },
];
