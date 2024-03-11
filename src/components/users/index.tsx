import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import i18next from 'i18next';
import { ColumnData } from '@components/admin/AdminTable/types';

export const unitTableColumns: ColumnData<TunitFields>[] = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'School',
    dataIndex: 'schoolName',
    key: 'school',
    render: (text) => <a>{text || i18next.t('not_linked')}</a>,
  },
  {
    title: 'Program',
    dataIndex: 'programName',
    key: 'school',
    render: (text) => <a>{text || i18next.t('not_linked')}</a>,
  },
  {
    title: 'Course',
    dataIndex: 'courseName',
    key: 'school',
    render: (text) => <a>{text || i18next.t('not_linked')}</a>,
  },
  {
    title: 'Create By',
    dataIndex: 'created_by',
    key: 'created_by',
  },
  {
    title: 'Create At',
    dataIndex: 'created_at',
    key: 'created_by',
  },
];
