import i18next from 'i18next';
import { I_FormFields } from 'types/form';

export const USER_FORM_FIELDS = {
  ['first_name']: {
    label: i18next.t('firstName'),
    key: 'firstName',
  },
  ['last_name']: {
    label: i18next.t('lastName'),
    key: 'lastName',
  },
  ['email']: {
    label: i18next.t('email'),
    key: 'email',
  },
  ['password']: {
    label: i18next.t('password'),
    key: 'password',
  },
  ['confirm_password']: {
    label: i18next.t('confirm_password'),
    key: 'confirm_password',
  },
  ['gender']: {
    label: i18next.t('gender'),
    key: 'gender',
  },
  ['email_password']: {
    label: i18next.t('email_password'),
    key: 'email_password',
  },
  ['role']: {
    label: i18next.t('role'),
    key: 'role',
  },
} satisfies I_FormFields;
