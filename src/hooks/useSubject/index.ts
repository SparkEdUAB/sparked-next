/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { T_CreateSubjectFields, T_FetchSubjects, T_SubjectFields, T_RawSubjectFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';

const useSubject = () => {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courses, setSubjects] = useState<Array<T_SubjectFields>>([]);
  const [originalSubjects, setOriginalSubjects] = useState<Array<T_SubjectFields>>([]);
  const [course, setSubject] = useState<T_SubjectFields | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<React.Key[]>([]);

  const createSubject = async (fields: T_CreateSubjectFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.CREATE_COURSE;
    const formData = {
      body: JSON.stringify({ ...fields }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url, formData);
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }

      onSuccessfullyDone?.();
      message.success(i18next.t('course_created'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editSubject = async (fields: T_SubjectFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_COURSE;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...course, ...fields, courseId: (course || fields)?._id }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url, formData);
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }

      onSuccessfullyDone?.();
      message.success(i18next.t('success'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchSubjects = async ({ limit = 1000, skip = 0 }: T_FetchSubjects) => {
    const url = API_LINKS.FETCH_COURSES;
    const params = { limit: limit.toString(), skip: skip.toString(), withMetaData: 'true' };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }

      const _courses = responseData.courses?.map(transformRawSubject);

      setSubjects(_courses);
      setOriginalSubjects(_courses);
      return _courses;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchSubjectById = async ({ courseId, withMetaData = false }: { courseId: string; withMetaData: boolean }) => {
    const url = API_LINKS.FETCH_COURSE_BY_ID;
    const params = { courseId: courseId.toString(), withMetaData: withMetaData.toString() };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }

      if (responseData.course) {
        const _course = responseData.course as T_RawSubjectFields;

        setSubject(transformRawSubject(_course));
        return _course;
      } else {
        return null;
      }
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selectedSubjectIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  };

  const deleteSubject = async (items?: T_SubjectFields[]) => {
    const url = API_LINKS.DELETE_COURSES;
    const formData = {
      body: JSON.stringify({ courseIds: items ? items.map((item) => item._id) : selectedSubjectIds }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url, formData);
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }

      message.success(i18next.t('success'));

      setSubjects(courses.filter((i) => selectedSubjectIds.indexOf(i._id) == -1));

      return true;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const findSubjectByName = async ({ withMetaData = false }: { withMetaData: boolean }) => {
    if (isLoading) {
      return message.warning(i18next.t('wait'));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t('search_empty'));
    }

    const url = API_LINKS.FIND_COURSE_BY_NAME;

    const params = { name: searchQuery.trim(), limit: '1000', skip: '0', withMetaData: 'true' };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }
      message.success(responseData.courses.length + ' ' + i18next.t('courses_found'));

      const _courses = (responseData.courses as T_RawSubjectFields[]).map(transformRawSubject);
      setSubjects(_courses);

      return _courses;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setSubjects(originalSubjects);
    }
  };

  const triggerEdit = async () => {
    if (!selectedSubjectIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedSubjectIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    // TODO: Add the correct link
    // router.push(getChildLinkByKey('edit', '') + `?courseId=${selectedSubjectIds[0]}`);
  };

  return {
    createSubject,
    fetchSubjects,
    courses,
    setSubjects,
    setSelectedSubjectIds,
    selectedSubjectIds,
    triggerDelete,
    triggerEdit,
    fetchSubjectById,
    router,
    course,
    isLoading,
    editSubject,
    findSubjectByName,
    onSearchQueryChange,
    searchQuery,
    originalSubjects,
    deleteSubject,
  };
};

export function transformRawSubject(course: T_RawSubjectFields, index: number = 0): T_SubjectFields {
  return {
    index: index + 1,
    key: course._id,
    _id: course._id,
    name: course.name,
    description: course.description,
    school: course.school,
    schoolId: course.school?._id,
    schoolName: course.school?.name,
    programName: course.program?.name,
    programId: course.program?._id,
    created_by: course.user?.email,
    created_at: new Date(course.created_at).toDateString(),
  };
}

export default useSubject;
