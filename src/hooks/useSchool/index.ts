/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { T_SchoolFields } from '@components/school/types';
import useNavigation from '@hooks/useNavigation';
import { message } from 'antd';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { T_CreateSchoolFields, T_FetchSchools } from './types';
import NETWORK_UTILS from 'utils/network';

const useSchool = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [schools, setSchools] = useState<Array<T_SchoolFields>>([]);
  const [tempSchools, setTempSchools] = useState<Array<T_SchoolFields>>([]);
  const [school, setSchool] = useState<T_SchoolFields | null>(null);
  const [selectedSchoolIds, setSelectedSchoolIds] = useState<React.Key[]>([]);

  const createSchool = async (fields: T_CreateSchoolFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.CREATE_SCHOOL;
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
      message.success(i18next.t('school_created'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editSchool = async (fields: T_SchoolFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_SCHOOL;
    const formData = {
      body: JSON.stringify({ ...fields, _id: (school || fields)?._id }),
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

  const fetchSchools = async ({ limit = 1000, skip = 0 }: T_FetchSchools) => {
    const url = API_LINKS.FETCH_SCHOOLS;
    const params = { limit: limit.toString(), skip: skip.toString() };

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

      const _schools = responseData.schools?.map(transformRawSchool);

      setSchools(_schools);
      setTempSchools(_schools);
      return _schools;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchSchool = async (schoolId: string) => {
    const url = API_LINKS.FETCH_SCHOOL;
    const params = { schoolId };

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

      const { _id, name, description } = responseData.school as T_SchoolFields;

      const _school = {
        _id,
        name,
        description,
      };

      setSchool(_school as T_SchoolFields);
      form && form.setFieldsValue(_school);
      return _school;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selectedSchoolIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  };

  const deleteSchools = async () => {
    const url = API_LINKS.DELETE_SCHOOLS;
    const formData = {
      body: JSON.stringify({ schoolIds: selectedSchoolIds }),
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

      setSchools(schools.filter((i) => selectedSchoolIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const findSchoolsByName = async () => {
    if (isLoading) {
      return message.warning(i18next.t('wait'));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t('search_empty'));
    }

    const url = API_LINKS.FIND_SCHOOLS_BY_NAME;
    const params = {
      name: searchQuery.trim(),
      limit: '1000',
      skip: '0',
    };

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
      message.success(responseData.schools.length + ' ' + i18next.t('schools_found'));

      setSchools(responseData.schools);

      return responseData.schools;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setSchools(tempSchools);
    }
  };

  // const triggerEdit = async () => {
  //   if (!selectedSchoolIds.length) {
  //     return message.warning(i18next.t('select_item'));
  //   } else if (selectedSchoolIds.length > 1) {
  //     return message.warning(i18next.t('select_one_item'));
  //   }

  //   router.push(getChildLinkByKey('edit', ADMIN_LINKS.schools) + `?schoolId=${selectedSchoolIds[0]}`);
  // };

  return {
    createSchool,
    fetchSchools,
    schools,
    setSchools,
    setSelectedSchoolIds,
    selectedSchoolIds,
    triggerDelete,
    // triggerEdit,
    fetchSchool,
    router,
    school,
    isLoading,
    editSchool,
    findSchoolsByName,
    onSearchQueryChange,
    searchQuery,
    tempSchools,
    deleteSchools,
  };
};

export function transformRawSchool(i: T_SchoolFields, index: number): T_SchoolFields {
  return {
    index: index + 1,
    key: i._id,
    _id: i._id,
    name: i.name,
    created_by: i.user.email,
    created_at: new Date(i.created_at).toDateString(),
    description: i.description,
    user: i.user,
  };
}

export default useSchool;
