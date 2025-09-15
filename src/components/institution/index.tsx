import i18next from 'i18next';
import { T_ColumnData } from '@components/admin/AdminTable/types';
import { T_InstitutionFields } from '@hooks/useInstitution/types';

export const institutionTableColumns: T_ColumnData<T_InstitutionFields>[] = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => <span className="font-medium">{text}</span>,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
    render: (type: string) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        type === 'school' ? 'bg-blue-100 text-blue-800' :
        type === 'college' ? 'bg-green-100 text-green-800' :
        type === 'university' ? 'bg-purple-100 text-purple-800' :
        'bg-orange-100 text-orange-800'
      }`}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'is_verified',
    key: 'is_verified',
    render: (verified: string, item: T_InstitutionFields) => (
      <span className={`px-2 py-1 rounded text-xs font-medium ${
        item.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}>
        {item.is_verified ? 'Verified' : 'Pending'}
      </span>
    ),
  },
  {
    title: 'Website',
    dataIndex: 'website',
    key: 'website',
    render: (website: string) => 
      website ? (
        <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          Visit
        </a>
      ) : (
        <span className="text-gray-400">None</span>
      ),
  },
  {
    title: i18next.t('created_by'),
    dataIndex: 'created_by',
    key: 'created_by',
  },
  {
    title: i18next.t('created_at'),
    dataIndex: 'created_at',
    key: 'created_at',
  },
];