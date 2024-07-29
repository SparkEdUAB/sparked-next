import { T_ColumnData } from '@components/admin/AdminTable/types';
import { T_UnitFields } from '@hooks/useUnit/types';

export const unitTableColumns: T_ColumnData<T_UnitFields>[] = [
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
    title: 'Subject',
    dataIndex: 'subjectName',
    key: 'subject',
  },
];
