import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { T_SchoolFields } from './types';
import { T_ColumnData } from '@components/admin/AdminTable/types';

export const schoolTableColumns: T_ColumnData<T_SchoolFields>[] = [
  {
    title: '#',
    dataIndex: 'index' as keyof T_SchoolFields,
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
