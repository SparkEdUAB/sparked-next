/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import ContentPlaceholder from '@components/atom/ContentPlaceholder/ContentPlaceholder';
import { AdminPageTitle } from '@components/layouts';
import useCourse from '@hooks/useCourse';
import useProgram from '@hooks/useProgram';
import useSchool from '@hooks/useSchool';
import useUsers from '@hooks/useUser';
import i18next from 'i18next';
import { useEffect } from 'react';

const CreateUserView = ({ onSuccessfullyDone }: { onSuccessfullyDone?: (() => void) | undefined }) => {
  const { createUser } = useUsers();
  const { fetchSchools, schools } = useSchool();
  const { fetchPrograms, programs } = useProgram();
  const { fetchCourses, courses } = useCourse();

  useEffect(() => {
    fetchSchools({});
    fetchPrograms({});
    fetchCourses({});
  }, []);

  return (
    <>
      <AdminPageTitle title={i18next.t('create_user')} />

      <ContentPlaceholder message="User management has not been implemented yet" />
    </>
  );
};

export default CreateUserView;
