import i18next from 'i18next';
import { T_MediaContentFields } from 'types/media-content';
import { StyledFileImageOutlinedIcon, StyledTableLinkView } from '@components/atom';
import { T_ColumnData } from '@components/admin/AdminTable/types';

export const mediaContentTableColumns: T_ColumnData<T_MediaContentFields>[] = [
  {
    title: '#',
    dataIndex: 'index',
    key: 'index',
    render: (text) => <StyledTableLinkView>{text}</StyledTableLinkView>,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <StyledTableLinkView>{text}</StyledTableLinkView>,
  },
  {
    title: 'Topic',
    dataIndex: 'topicName',
    key: 'Topic',
    render: (text) => <StyledTableLinkView>{text || i18next.t('not_linked')}</StyledTableLinkView>,
  },
  {
    title: 'Media',
    dataIndex: 'fileUrl',
    key: 'Topic',
    render: (url) => (
      <StyledTableLinkView target={'_blank'} href={url}>
        <StyledFileImageOutlinedIcon />
      </StyledTableLinkView>
    ),
  },
];
