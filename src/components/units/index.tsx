import i18next from 'i18next';
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
  // {
  //   title: 'School',
  //   dataIndex: 'schoolName',
  //   key: 'schools',
  // },
  // {
  //   title: 'Program',
  //   dataIndex: 'programName',
  //   key: 'programs',
  // },
  {
    title: 'Course',
    dataIndex: 'courseName',
    key: 'course',
  },
  // {
  //   title: 'Create By',
  //   dataIndex: 'created_by',
  //   key: 'created_by',
  // },
  // {
  //   title: 'Create At',
  //   dataIndex: 'created_at',
  //   key: 'created_at',
  // },
];
