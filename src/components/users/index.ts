import { T_ColumnData } from '@components/admin/AdminTable/types';
import i18next from 'i18next';

export const userTableColumns: T_ColumnData<any>[] = [
  {
    title: i18next.t('First Name'),
    dataIndex: 'firstName',
    key: 'firstName',
  },
  {
    title: i18next.t('Last Name'),
    dataIndex: 'lastName',
    key: 'lastName',
  },
  {
    title: i18next.t('email'),
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: i18next.t('role'),
    dataIndex: 'role',
    key: 'role',
  },
];
