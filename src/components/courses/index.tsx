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
];
