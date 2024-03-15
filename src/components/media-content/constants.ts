import i18next from 'i18next';
import { T_MediaContentFormFields } from 'types/media-content';

export const MEDIA_CONTENT_FORM_FIELDS: T_MediaContentFormFields = {
  name: {
    label: i18next.t('name'),
    key: 'name',
  },
  ['description']: {
    label: i18next.t('description'),
    key: 'description',
  },
  ['school']: {
    label: i18next.t('school'),
    key: 'schoolId',
  },
  ['program']: {
    label: i18next.t('program'),
    key: 'programId',
  },
  ['course']: {
    label: i18next.t('course'),
    key: 'courseId',
  },
  ['unit']: {
    label: i18next.t('units'),
    key: 'unitId',
  },
  ['topic']: {
    label: i18next.t('topic'),
    key: 'topicId',
  },
};
