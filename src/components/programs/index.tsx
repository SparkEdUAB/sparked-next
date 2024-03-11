import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ColumnData } from '@components/admin/AdminTable/types';
import { TProgramFields } from '@hooks/useProgram/types';

export const programTableColumns: ColumnData<TProgramFields>[] = [
  {
    title: '#',
    dataIndex: 'index',
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
    title: 'School',
    dataIndex: 'schoolName',
    key: 'school',
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
