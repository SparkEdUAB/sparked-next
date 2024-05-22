import { T_ColumnData } from '@components/admin/AdminTable/types';
import { T_ProgramFields } from '@hooks/useProgram/types';

export const programTableColumns: T_ColumnData<T_ProgramFields>[] = [
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
