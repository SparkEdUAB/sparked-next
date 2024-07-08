/* eslint-disable react-hooks/exhaustive-deps */
'use client';

// import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { T_CreateCategoryFields, T_FetchCategorys, T_CategoryFields, T_RawCategoryFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useCategory = () => {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartegories, setCategories] = useState<Array<T_CategoryFields>>([]);
  const [originalCategories, setOriginalCategories] = useState<Array<T_CategoryFields>>([]);
  const [cartegory, setCategory] = useState<T_CategoryFields | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<React.Key[]>([]);

  const createCategory = async (fields: T_CreateCategoryFields, onSuccessfullyDone?: () => void) => {
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
  };

  const editCategory = async (fields: T_CategoryFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_COURSE;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...cartegory, ...fields, courseId: (cartegory || fields)?._id }),
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
  };

  const fetchCategories = async ({ limit = 1000, skip = 0 }: T_FetchCategorys) => {
    const url = API_LINKS.FETCH_CATEGORIES;
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

      const _categories = responseData.courses?.map(transformRawCategory);

      setCategories(_categories);
      setOriginalCategories(_categories);
      return _categories;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchCategoryById = async ({ courseId, withMetaData = false }: { courseId: string; withMetaData: boolean }) => {
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
        const _course = responseData.course as T_RawCategoryFields;

        setCategory(transformRawCategory(_course));
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
    if (!selectedCategoryIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  };

  const deleteCategory = async (items?: T_CategoryFields[]) => {
    const url = API_LINKS.DELETE_CATEGORIES;
    const formData = {
      body: JSON.stringify({ courseIds: items ? items.map((item) => item._id) : selectedCategoryIds }),
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

      setCategories(cartegories.filter((i) => selectedCategoryIds.indexOf(i._id) == -1));

      return true;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const findCategoryByName = async ({ withMetaData = false }: { withMetaData: boolean }) => {
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

      const _categories = (responseData.courses as T_RawCategoryFields[]).map(transformRawCategory);
      setCategories(_categories);

      return _categories;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setCategories(originalCategories);
    }
  };

  const triggerEdit = async () => {
    if (!selectedCategoryIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedCategoryIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    // TODO: Add the correct link
    // router.push(getChildLinkByKey('edit', '') + `?courseId=${selectedCategoryIds[0]}`);
  };

  return {
    createCategory,
    fetchCategories,
    cartegories,
    setCategories,
    setSelectedCategoryIds,
    selectedCategoryIds,
    triggerDelete,
    triggerEdit,
    fetchCategoryById,
    router,
    cartegory,
    isLoading,
    editCategory,
    findCategoryByName,
    onSearchQueryChange,
    searchQuery,
    originalCategories,
    deleteCategory,
  };
};

export function transformRawCategory(course: T_RawCategoryFields, index: number = 0): T_CategoryFields {
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

export default useCategory;
