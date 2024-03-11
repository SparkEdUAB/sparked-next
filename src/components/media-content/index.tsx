import type { ColumnsType } from 'antd/es/table';
import i18next from 'i18next';
import { T_MediaContentFields } from 'types/media-content';
import { StyledFileImageOutlinedIcon, StyledTableLinkView } from '@components/atom';
import { ColumnData } from '@components/admin/AdminTable/types';

export const mediaContentTableColumns: ColumnData<T_MediaContentFields>[] = [
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
    title: 'School',
    dataIndex: 'schoolName',
    key: 'school',
    render: (text) => <StyledTableLinkView>{text || i18next.t('not_linked')}</StyledTableLinkView>,
  },
  {
    title: 'Program',
    dataIndex: 'programName',
    key: 'Program',
    render: (text) => <StyledTableLinkView>{text || i18next.t('not_linked')}</StyledTableLinkView>,
  },
  {
    title: 'Course',
    dataIndex: 'courseName',
    key: 'Course',
    render: (text) => <StyledTableLinkView>{text || i18next.t('not_linked')}</StyledTableLinkView>,
  },
  {
    title: 'Unit',
    dataIndex: 'unitName',
    key: 'Unit',
    render: (text) => <StyledTableLinkView>{text || i18next.t('not_linked')}</StyledTableLinkView>,
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
  {
    title: 'Created By',
    dataIndex: 'created_by',
    key: 'created_by',
    render: (text) => <StyledTableLinkView>{text}</StyledTableLinkView>,
  },
  {
    title: 'Created At',
    dataIndex: 'created_at',
    key: 'created_by',
    render: (text) => <StyledTableLinkView>{text}</StyledTableLinkView>,
  },
];
