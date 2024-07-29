import i18next from 'i18next';
import { I_FormFields } from 'types/form';

export const GRADE_FORM_FIELDS = {
  ['name']: {
    label: i18next.t('name'),
    key: 'name',
  },
  ['description']: {
    label: i18next.t('description'),
    key: 'description',
  },
  // ['school']: {
  //   label: i18next.t('school'),
  //   key: 'schoolId',
  // },
  // ['program']: {
  //   label: i18next.t('program'),
  //   key: 'programId',
  // },
} satisfies I_FormFields;
