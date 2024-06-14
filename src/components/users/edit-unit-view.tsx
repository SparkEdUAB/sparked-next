'use client';

import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';
import { AdminPageTitle } from '@components/layouts';
import i18next from 'i18next';

const EditUserView: React.FC = () => {
  return (
    <>
      <AdminPageTitle title={i18next.t('edit_user')} />

      <ContentPlaceholder message="User management has not been implemented yet" />
    </>
  );
};

export default EditUserView;
