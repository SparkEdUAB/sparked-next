'use client';

import { AdminPageTitle } from '@components/layouts';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import useCourse from '@hooks/useCourse';
import { TcourseFields } from '@hooks/useCourse/types';
import { AdminTable } from '../admin/AdminTable/AdminTable';
import { courseTableColumns } from '.';

const CourseListView: React.FC = observer(() => {
  const {
    fetchCourses,
    courses,
    selectedCourseIds,
    setSelectedCourseIds,
    triggerDelete,
    triggerEdit,
    findCourseByName,
    onSearchQueryChange,
    isLoading,
  } = useCourse();
  const { getChildLinkByKey } = useNavigation();

  useEffect(() => {
    fetchCourses({});
  }, [0]);

  const rowSelection = {
    selectedRowKeys: selectedCourseIds,
    onChange: (selectedRowKeys: React.Key[], selectedRows: TcourseFields[]) => {
      setSelectedCourseIds(selectedRowKeys);
    },
  };

  return (
    <>
      <AdminPageTitle title={i18next.t('courses')} />

      <TextInput
        onChange={(e) => onSearchQueryChange(e.target.value)}
        icon={HiMagnifyingGlass}
        className="table-search-box"
        placeholder={i18next.t('search_courses')}
        required
        type="text"
        onKeyDown={(e) => {
          e.keyCode === 13 ? findCourseByName({ withMetaData: true }) : null;
        }}
      />
      <AdminTable<TcourseFields>
        triggerDelete={triggerDelete}
        rowSelection={rowSelection}
        items={courses}
        isLoading={isLoading}
        createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.courses)}
        getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.courses) + `?courseId=${id}`}
        columns={courseTableColumns}
      />
    </>
  );
});

export default CourseListView;
