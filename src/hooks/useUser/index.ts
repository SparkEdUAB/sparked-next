'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateUserFields, T_FetchUsers, T_UserFields } from './types';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useUsers = () => {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [users, setUsers] = useState<Array<T_UserFields>>([]);
  const [tempUsers, setTempUsers] = useState<Array<T_UserFields>>([]);
  const [user, setUser] = useState<T_UserFields | null>(null);
  const [selectedUserIds, setSelectedUserIds] = useState<React.Key[]>([]);

  const createUser = useCallback(
    async (fields: T_CreateUserFields, onSuccessfullyDone: () => void) => {
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        onSuccessfullyDone?.();

        message.success(i18next.t('unit_created'));
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editUnit = useCallback(
    async (fields: T_UserFields, onSuccessfullyDone: () => void) => {
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        onSuccessfullyDone?.();

        message.success(i18next.t('success'));
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message, user],
  );

  const fetchUnits = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchUsers) => {
      const url = API_LINKS.FETCH_UNITS;
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
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
    },
    [message],
  );

  const fetchUnitById = useCallback(
    async ({ unitId, withMetaData = false }: { unitId: string; withMetaData: boolean }) => {
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
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
          return _user;
        } else {
          return null;
        }
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const triggerDelete = useCallback(async () => {
    if (!selectedUserIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  }, [message, selectedUserIds.length]);

  const deleteUsers = useCallback(async () => {
    const url = API_LINKS.DELETE_UNITS;
    const formData = {
      body: JSON.stringify({ unitIds: selectedUserIds }),
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

      message.success(i18next.t('success'));

      setUsers(users.filter((i) => selectedUserIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  }, [message, selectedUserIds, users]);

  const findUsersByName = useCallback(
    async ({ withMetaData = false }: { withMetaData: boolean }) => {
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
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
    },
    [isLoading, message, searchQuery],
  );

  const onSearchQueryChange = useCallback(
    (text: string) => {
      setSearchQuery(text);

      if (!text.trim().length) {
        setUsers(tempUsers);
      }
    },
    [tempUsers],
  );

  const triggerEdit = useCallback(async () => {
    if (!selectedUserIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedUserIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${selectedUserIds[0]}`);
  }, [getChildLinkByKey, message, router, selectedUserIds]);

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
    deleteUsers,
  };
};

export default useUsers;
