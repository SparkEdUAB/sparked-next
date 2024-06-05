import i18next from 'i18next';
import { I_FormFields } from 'types/form';

export const SUBJECT_FORM_FIELDS: I_FormFields = {
  ['name']: {
    label: i18next.t('name'),
    key: 'name',
  },
  ['description']: {
    label: i18next.t('description'),
    key: 'description',
  },
  // ['grade']: {
  //   label: i18next.t('school'),
  //   key: 'grade_id',
  // },
  // ['program']: {
  //   label: i18next.t('program'),
  //   key: 'programId',
  // },
};
