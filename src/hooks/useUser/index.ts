/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { message } from 'antd';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import UiStore from '@state/mobx/uiStore';
import { T_CreateUserFields, T_FetchUsers, T_UserFields } from './types';
import type { CheckboxProps } from 'antd';

const useUsers = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<Array<T_UserFields>>([]);
  const [tempUsers, setTempUsers] = useState<Array<T_UserFields>>([]);
  const [user, setUser] = useState<T_UserFields | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<React.Key[]>([]);

  useEffect(() => {
    UiStore.confirmDialogStatus && selectedUserIds.length && deleteUsers();
  }, [UiStore.confirmDialogStatus]);

  const createUser = async (fields: T_CreateUserFields, onSuccessfullyDone: () => void) => {
    const url = API_LINKS.CREATE_USER;
    const formData = {
      body: JSON.stringify({ ...fields }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const resp = await fetch(url, formData);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.code);
        return false;
      }

      onSuccessfullyDone?.();

      message.success(i18next.t('unit_created'));
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editUnit = async (fields: T_UserFields, onSuccessfullyDone: () => void) => {
    const url = API_LINKS.EDIT_UNIT;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...user, ...fields, unitId: user?._id }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const resp = await fetch(url, formData);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.code);
        return false;
      }

      onSuccessfullyDone?.();

      message.success(i18next.t('success'));
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchUnits = async ({ limit = 1000, skip = 0 }: T_FetchUsers) => {
    const url = API_LINKS.FETCH_UNIT;
    const formData = {
      body: JSON.stringify({ limit, skip, withMetaData: true }),
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
        message.warning(responseData.code);
        return false;
      }

      const _units = responseData.units?.map(
        (i: T_UserFields, index: number) =>
          ({
            index: index + 1,
            key: i._id,
            _id: i._id,
            name: i.name,
            school: i.school,
            schoolId: i.school?._id,
            schoolName: i.school?.name,
            programName: i.program?.name,
            courseName: i.course?.name,
            programId: i.program?._id,
            created_by: i.user?.email,
            created_at: new Date(i.created_at).toDateString(),
          } satisfies T_UserFields),
      );

      setUsers(_units);
      setTempUsers(_units);
      return _units;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchUnitById = async ({ unitId, withMetaData = false }: { unitId: string; withMetaData: boolean }) => {
    const url = API_LINKS.FETCH_UNIT_BY_ID;
    const formData = {
      body: JSON.stringify({ unitId, withMetaData }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const resp = await fetch(url, formData);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.code);
        return false;
      }

      if (responseData.unit) {
        const { _id, name, school, program, created_at } = responseData.unit as T_UserFields;

        const _user: T_UserFields = {
          _id,
          name,
          schoolId: school?._id,
          programId: program?._id,
          index: 1,
          key: _id,
          created_at,
        };

        setUser(_user);
        form && form.setFieldsValue(_user);
        return _user;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selectedUserIds.length) {
      return message.warning(i18next.t('select_items'));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deleteUsers = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_UNITS;
    const formData = {
      body: JSON.stringify({ unitIds: selectedUserIds }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      UiStore.setLoaderStatus(true);
      setLoaderStatus(true);
      const resp = await fetch(url, formData);
      UiStore.setLoaderStatus(false);
      setLoaderStatus(false);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.code);
        return false;
      }

      UiStore.setConfirmDialogVisibility(false);
      message.success(i18next.t('success'));

      setUsers(users.filter((i) => selectedUserIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      setLoaderStatus(false);
      UiStore.setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const findUsersByName = async ({ withMetaData = false }: { withMetaData: boolean }) => {
    if (isLoading) {
      return message.warning(i18next.t('wait'));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t('search_empty'));
    }

    const url = API_LINKS.FIND_UNITS_BY_NAME;
    const formData = {
      body: JSON.stringify({
        name: searchQuery.trim(),
        limit: 1000,
        skip: 0,
        withMetaData,
      }),
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
        message.warning(responseData.code);
        return false;
      }
      message.success(responseData.courses.length + ' ' + i18next.t('courses_found'));

      setUsers(responseData.courses);

      return responseData.courses;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setUsers(tempUsers);
    }
  };

  const triggerEdit = async () => {
    if (!selectedUserIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedUserIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${selectedUserIds[0]}`);
  };

  const onEmailPasswordChange: CheckboxProps['onChange'] = (e) => {};

  return {
    createUser,
    fetchUnits,
    users,
    setUsers,
    setSelectedUserIds,
    selectedUserIds,
    triggerDelete,
    triggerEdit,
    fetchUnitById,
    router,
    user,
    isLoading,
    editUnit,
    findUsersByName,
    onSearchQueryChange,
    searchQuery,
    tempUsers,
    onEmailPasswordChange,
    deleteUsers,
  };
};

export default useUsers;
