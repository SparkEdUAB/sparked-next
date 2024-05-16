import i18next from 'i18next';
import { T_CourseFields } from '@hooks/useCourse/types';
import { T_ColumnData } from '@components/admin/AdminTable/types';

export const courseTableColumns: T_ColumnData<T_CourseFields>[] = [
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
  // {
  //   title: 'School',
  //   dataIndex: 'schoolName',
  //   key: 'schools',
  //   render: (text) => <a>{text || i18next.t('not_linked')}</a>,
  // },
  // {
  //   title: 'Program',
  //   dataIndex: 'programName',
  //   key: 'programs',
  //   render: (text) => <a>{text || i18next.t('not_linked')}</a>,
  // },
  // {
  //   title: 'Created By',
  //   dataIndex: 'created_by',
  //   key: 'created_by',
  //   render: (text) => <a>{text}</a>,
  // },
  // {
  //   title: 'Create At',
  //   dataIndex: 'created_at',
  //   key: 'created_at',
  // },
];
