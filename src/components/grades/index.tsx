import i18next from 'i18next';
import { T_GradeFields } from '@hooks/useGrade/types';
import { T_ColumnData } from '@components/admin/AdminTable/types';

export const gradeTableColumns: T_ColumnData<T_GradeFields>[] = [
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
