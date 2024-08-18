'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateGradeFields, T_FetchGrades, T_GradeFields, T_RawGradeFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useGrade = () => {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [grades, setGrades] = useState<Array<T_GradeFields>>([]);
  const [originalGrades, setOriginalGrades] = useState<Array<T_GradeFields>>([]);
  const [grade, setGrade] = useState<T_GradeFields | null>(null);
  const [selectedGradeIds, setSelectedGradeIds] = useState<React.Key[]>([]);

  const createGrade = useCallback(
    async (fields: T_CreateGradeFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.CREATE_GRADE;
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        onSuccessfullyDone?.();
        message.success(i18next.t('grade_created'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editGrade = useCallback(
    async (fields: T_GradeFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.EDIT_GRADE;
      const formData = {
        //spread grade in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
        body: JSON.stringify({ ...grade, ...fields, gradeId: (grade || fields)?._id }),
        method: 'put',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
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
    [grade, message],
  );

  const fetchGrades = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchGrades) => {
      const url = API_LINKS.FETCH_GRADES;
      const params = { limit: limit.toString(), skip: skip.toString(), withMetaData: 'true' };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const grades = responseData.grades?.map(transformRawGrade);

        setGrades(grades);
        setOriginalGrades(grades);
        return grades;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const fetchGradeById = useCallback(
    async ({ gradeId, withMetaData = false }: { gradeId: string; withMetaData: boolean }) => {
      const url = API_LINKS.FETCH_GRADE_BY_ID;
      const params = { gradeId: gradeId.toString(), withMetaData: withMetaData.toString() };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.grade) {
          const _grade = responseData.grade as T_RawGradeFields;

          setGrade(transformRawGrade(_grade));
          return _grade;
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
    if (!selectedGradeIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  }, [message, selectedGradeIds.length]);

  const deleteGrade = useCallback(
    async (items?: T_GradeFields[]) => {
      const url = API_LINKS.DELETE_GRADES;
      const formData = {
        body: JSON.stringify({ gradeIds: items ? items.map((item) => item._id) : selectedGradeIds }),
        method: 'delete',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        message.success(i18next.t('success'));

        setGrades(grades.filter((i) => selectedGradeIds.indexOf(i._id) == -1));

        return true;
      } catch (err: any) {
        setLoaderStatus(false);

        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [grades, message, selectedGradeIds],
  );

  const findGradeByName = useCallback(async () => {
    if (isLoading) {
      return message.warning(i18next.t('wait'));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t('search_empty'));
    }

    const url = API_LINKS.FIND_GRADE_BY_NAME;

    const params = { name: searchQuery.trim(), limit: '1000', skip: '0', withMetaData: 'true' };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
      setLoaderStatus(false);

      const responseData = await resp.json();

      if (!resp.ok || responseData.isError) {
        message.warning(getProcessCodeMeaning(responseData.code));
        return false;
      }
      message.success(responseData.grades.length + ' ' + i18next.t('grades_found'));

      const _grades = (responseData.grades as T_RawGradeFields[]).map(transformRawGrade);
      setGrades(_grades);

      return _grades;
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
        setGrades(originalGrades);
      }
    },
    [originalGrades],
  );

  const triggerEdit = useCallback(async () => {
    if (!selectedGradeIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedGradeIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.grades) + `?gradeId=${selectedGradeIds[0]}`);
  }, [getChildLinkByKey, message, router, selectedGradeIds]);

  return {
    createGrade,
    fetchGrades,
    grades,
    setGrades,
    setSelectedGradeIds,
    selectedGradeIds,
    triggerDelete,
    triggerEdit,
    fetchGradeById,
    router,
    grade,
    isLoading,
    editGrade,
    findGradeByName,
    onSearchQueryChange,
    searchQuery,
    originalGrades,
    deleteGrade,
  };
};

export function transformRawGrade(grade: T_RawGradeFields, index: number = 0): T_GradeFields {
  return {
    index: index + 1,
    key: grade._id,
    _id: grade._id,
    name: grade.name,
    description: grade.description,
    created_by: grade.user?.email,
    created_at: new Date(grade.created_at).toDateString(),
  };
}

export default useGrade;
