import i18next from 'i18next';
import { I_FormFields } from 'types/form';

export const PROGRAM_FORM_FIELDS = {
  ['name']: {
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
} satisfies I_FormFields;
