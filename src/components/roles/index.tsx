import { T_ColumnData } from '@components/admin/AdminTable/types';
import { T_RoleFields } from '@hooks/useRoles/types';

export const rolesTableColumns: T_ColumnData<T_RoleFields>[] = [
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
];
