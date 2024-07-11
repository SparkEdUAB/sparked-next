import { T_SubjectFields } from '@hooks/useSubject/types';
import { T_ColumnData } from '@components/admin/AdminTable/types';

export const subjectTableColumns: T_ColumnData<T_SubjectFields>[] = [
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
    title: 'Grade',
    dataIndex: 'gradeName',
    key: 'gradeName',
  },
];
