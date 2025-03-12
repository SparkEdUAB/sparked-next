import { T_ColumnData } from '@components/admin/AdminTable/types';
import i18next from 'i18next';

export const userTableColumns: T_ColumnData<any>[] = [
  {
    title: i18next.t('Name'),
    dataIndex: 'firstName',
    key: 'name',
    render: (_, record) => (
      <div>
        {record.firstName} {record.lastName}
      </div>
    ),
  },
  {
    title: i18next.t('email'),
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: i18next.t('Phone'),
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
    render: (phoneNumber: string) => phoneNumber || '-',
  },
  {
    title: i18next.t('role'),
    dataIndex: 'role',
    key: 'role',
    render: (role: string) => (
      <div className="flex items-center gap-2">
        <span>{role || 'Student'}</span>
      </div>
    ),
  },
];
