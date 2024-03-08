import { Space } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import i18next from 'i18next';
import { TcourseFields } from '@hooks/useCourse/types';
import { ReactNode } from 'react';
import { ColumnData } from '@components/admin/AdminTable/types';

export const courseTableColumns: ColumnData<TcourseFields>[] = [
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
    key: 'program',
    render: (text) => <a>{text || i18next.t('not_linked')}</a>,
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
    key: 'created_at',
  },
];
