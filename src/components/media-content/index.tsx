import i18next from 'i18next';
import { T_MediaContentFields } from 'types/media-content';
import { T_ColumnData } from '@components/admin/AdminTable/types';
import { AiOutlineFileImage } from 'react-icons/ai';

export const mediaContentTableColumns: T_ColumnData<T_MediaContentFields>[] = [
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
    title: 'Topic',
    dataIndex: 'topicName',
    key: 'Topic',
    render: (text) => <a>{text || i18next.t('not_linked')}</a>,
  },
  {
    title: 'Media',
    dataIndex: 'fileUrl',
    key: 'Topic',
    render: (url) => (
      <a target={'_blank'} rel="noreferrer" className="text-3xl" href={url}>
        <AiOutlineFileImage />
      </a>
    ),
  },
];
