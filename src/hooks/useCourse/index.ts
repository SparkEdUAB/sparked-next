'use client';

import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateCourseFields, T_FetchCourses, T_CourseFields, T_RawCourseFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useCourse = () => {
  const { router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [courses, setCourses] = useState<Array<T_CourseFields>>([]);
  const [originalCourses, setOriginalCourses] = useState<Array<T_CourseFields>>([]);
  const [course, setCourse] = useState<T_CourseFields | null>(null);
  const [selectedCourseIds, setSelectedCourseIds] = useState<React.Key[]>([]);

  const createCourse = useCallback(
    async (fields: T_CreateCourseFields, onSuccessfullyDone?: () => void) => {
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        onSuccessfullyDone?.();
        message.success(i18next.t('course_created'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editCourse = useCallback(
    async (fields: T_CourseFields, onSuccessfullyDone?: () => void) => {
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        onSuccessfullyDone?.();
        message.success(i18next.t('success'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [course, message],
  );

  const fetchCourses = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchCourses) => {
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const _courses = responseData.courses?.map(transformRawCourse);

        setCourses(_courses);
        setOriginalCourses(_courses);
        return _courses;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const fetchCourseById = useCallback(
    async ({ courseId, withMetaData = false }: { courseId: string; withMetaData: boolean }) => {
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.course) {
          const _course = responseData.course as T_RawCourseFields;

          setCourse(transformRawCourse(_course));
          return _course;
        } else {
          return null;
        }
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const triggerDelete = useCallback(async () => {
    if (!selectedCourseIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  }, [message, selectedCourseIds.length]);

  const deleteCourse = useCallback(
    async (items?: T_CourseFields[]) => {
      const url = API_LINKS.DELETE_COURSES;
      const formData = {
        body: JSON.stringify({ courseIds: items ? items.map((item) => item._id) : selectedCourseIds }),
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        message.success(i18next.t('success'));

        setCourses(courses.filter((i) => selectedCourseIds.indexOf(i._id) == -1));

        return true;
      } catch (err: any) {
        setLoaderStatus(false);

        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [courses, message, selectedCourseIds],
  );

  const findCourseByName = useCallback(async () => {
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
        message.warning(getProcessCodeMeaning(responseData.code));
        return false;
      }
      message.success(responseData.courses.length + ' ' + i18next.t('courses_found'));

      const _courses = (responseData.courses as T_RawCourseFields[]).map(transformRawCourse);
      setCourses(_courses);

      return _courses;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  }, [isLoading, message, searchQuery]);

  const onSearchQueryChange = useCallback(
    (text: string) => {
      setSearchQuery(text);

      if (!text.trim().length) {
        setCourses(originalCourses);
      }
    },
    [originalCourses],
  );

  const triggerEdit = useCallback(async () => {
    if (!selectedCourseIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedCourseIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    // TODO: Add the correct link
    // router.push(getChildLinkByKey('edit', '') + `?courseId=${selectedCourseIds[0]}`);
  }, [message, selectedCourseIds.length]);

  return {
    createCourse,
    fetchCourses,
    courses,
    setCourses,
    setSelectedCourseIds,
    selectedCourseIds,
    triggerDelete,
    triggerEdit,
    fetchCourseById,
    router,
    course,
    isLoading,
    editCourse,
    findCourseByName,
    onSearchQueryChange,
    searchQuery,
    originalCourses,
    deleteCourse,
  };
};

export function transformRawCourse(course: T_RawCourseFields, index: number = 0): T_CourseFields {
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

export default useCourse;
