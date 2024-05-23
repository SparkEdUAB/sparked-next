/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AdminPageTitle } from '@components/layouts';
import useProgram from '@hooks/useProgram';
import i18next from 'i18next';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { USER_FORM_FIELDS } from './constants';
import useSchool from '@hooks/useSchool';
import useUnit from '@hooks/useUnit';
import useCourse from '@hooks/useCourse';
import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';

const EditUserView: React.FC = () => {
  const { editUnit, fetchUnitById, unit } = useUnit();
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();
  const { fetchCourses, courses } = useCourse();

  const searchParams = useSearchParams();

  useEffect(() => {
    fetchUnitById({
      unitId: searchParams.get('unitId') as string,
      withMetaData: true,
    });

    fetchPrograms({});
    fetchSchools({});
    fetchCourses({});
  }, []);

  return (
    <>
      <AdminPageTitle title={i18next.t('edit_user')} />

      <ContentPlaceholder message="User management has not been implemented yet" />
    </>
  );
};

export default EditUserView;
