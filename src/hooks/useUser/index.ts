'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateUserFields, T_FetchUsers, T_RawUserFields, T_UserFields } from './types';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

export function transformRawUser(user: T_RawUserFields) {
  return {
    _id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    created_at: user.created_at,
    // updated_at: user.updatedAt,
  };
}

export default function useUser() {
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

        message.success(i18next.t('user_created'));
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editUser = useCallback(
    async (fields: T_UserFields, onSuccessfullyDone: () => void) => {
      const url = API_LINKS.EDIT_USER;
      const formData = {
        //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
        body: JSON.stringify({ ...user, ...fields, userId: user?._id }),
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

  const fetchUsers = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchUsers) => {
      const url = API_LINKS.FETCH_USERS;
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

        const _users = responseData.users?.map(
          (i: T_UserFields, index: number) =>
            ({
              index: index + 1,
              // @ts-expect-error
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

        setUsers(_users);
        setTempUsers(_users);
        return _users;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const fetchUserById = useCallback(
    async ({ userId, withMetaData = false }: { userId: string; withMetaData: boolean }) => {
      const url = API_LINKS.FIND_USER_BY_ID;
      const formData = {
        body: JSON.stringify({ userId, withMetaData }),
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

        if (responseData.user) {
          const { _id, name, school, program, created_at } = responseData.user as T_UserFields;

          const _user: T_UserFields = {
            _id,
            name,
            schoolId: school?._id,
            programId: program?._id,
            index: 1,
            //   @ts-expect-error
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
    const url = API_LINKS.DELETE_USERS;
    const formData = {
      body: JSON.stringify({ userIds: selectedUserIds }),
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

      //   @ts-expect-error
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

      const url = API_LINKS.FIND_USERS_BY_NAME;
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

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.users) + `?userId=${selectedUserIds[0]}`);
  }, [getChildLinkByKey, message, router, selectedUserIds]);

  const assignRole = async (userId: string, roleId: string) => {
    try {
      const response = await fetch(API_LINKS.ASSIGN_USER_ROLE, {
        method: 'PUT',
        body: JSON.stringify({ userId, roleId }),
      });

      const data = await response.json();

      if (data.isError) {
        throw new Error(data.message);
      }

      return true;
    } catch (error) {
      console.error('Failed to assign role:', error);
      throw error;
    }
  };

  return {
    createUser,
    fetchUsers,
    users,
    setUsers,
    setSelectedUserIds,
    selectedUserIds,
    triggerDelete,
    triggerEdit,
    fetchUserById,
    router,
    user,
    isLoading,
    editUser,
    findUsersByName,
    onSearchQueryChange,
    searchQuery,
    tempUsers,
    deleteUsers,
    assignRole,
  };
}

// export default useUsers;
