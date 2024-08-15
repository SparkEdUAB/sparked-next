import { T_ColumnData } from '@components/admin/AdminTable/types';
import { T_PageLinkFields } from '@hooks/usePageLinks/types';

export const pagesTableColumns: T_ColumnData<T_PageLinkFields>[] = [
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
    title: 'URL Path',
    dataIndex: 'link',
    key: 'link',
    render: (text) => <a>{text}</a>,
  },
];
