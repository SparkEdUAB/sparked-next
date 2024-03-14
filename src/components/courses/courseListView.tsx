'use client';

import { AdminPageTitle } from '@components/layouts';
import useNavigation from '@hooks/useNavigation';
import { Modal, TextInput } from 'flowbite-react';
import i18next from 'i18next';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { HiMagnifyingGlass } from 'react-icons/hi2';
import useCourse from '@hooks/useCourse';
import { TcourseFields } from '@hooks/useCourse/types';
import { AdminTable } from '../admin/AdminTable/AdminTable';
import { courseTableColumns } from '.';
import EditCourseView from './editCourseView';
import CreateCourseView from './createCourseView';

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
    deleteCourse,
  } = useCourse();
  const { getChildLinkByKey } = useNavigation();
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [edittingCourseWithId, setEdittingCourseWithId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses({});
  }, [0]);

  const rowSelection = {
    selectedRowKeys: selectedCourseIds,
    onChange: (selectedRowKeys: React.Key[]) => {
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
        deleteItems={deleteCourse}
        rowSelection={rowSelection}
        items={courses}
        isLoading={isLoading}
        // createNewUrl={getChildLinkByKey('create', ADMIN_LINKS.courses)}
        // getEditUrl={(id) => getChildLinkByKey('edit', ADMIN_LINKS.courses) + `?courseId=${id}`}
        createNew={() => setCreatingCourse(true)}
        editItem={(id) => setEdittingCourseWithId(id)}
        columns={courseTableColumns}
      />
      <Modal dismissible show={creatingCourse} onClose={() => setCreatingCourse(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <CreateCourseView
            onSuccessfullyDone={() => {
              fetchCourses({});
              setCreatingCourse(false);
            }}
          />
        </Modal.Body>
      </Modal>
      <Modal dismissible show={!!edittingCourseWithId} onClose={() => setEdittingCourseWithId(null)} popup>
        <Modal.Header />
        <Modal.Body>
          {edittingCourseWithId ? (
            <EditCourseView
              courseId={edittingCourseWithId}
              onSuccessfullyDone={() => {
                fetchCourses({});
                setEdittingCourseWithId(null);
              }}
            />
          ) : null}
        </Modal.Body>
      </Modal>
    </>
  );
});

export default CourseListView;
