import i18next from 'i18next';
import { I_FormFields } from 'types/form';

export const PAGE_FORM_FIELDS = {
  ['name']: {
    label: i18next.t('name'),
    key: 'name',
  },
  ['description']: {
    label: i18next.t('description'),
    key: 'description',
  },
  ['pageLink']: {
    label: i18next.t('page_link'),
    key: 'pageLink',
  },
} satisfies I_FormFields;
