import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useToastMessage } from 'providers/ToastMessageContext';
import { useCallback, useState } from 'react';
import NETWORK_UTILS from 'utils/network';
import { T_CreateRoleFields, T_RawRoleFields, T_RoleFields } from './types';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

export function useRoles() {
  const message = useToastMessage();

  const [selectedRoleIds, setSelectedRoleIds] = useState<React.Key[]>([]);
  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [tempRoles, setTempRoles] = useState<Array<T_RoleFields>>([]);
  const [roles, setRoles] = useState<Array<T_RoleFields>>([]);
  const [role, setRole] = useState<T_RoleFields | null>(null);

  const createRole = useCallback(
    async (fields: T_CreateRoleFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.CREATE_USER_ROLE;
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

        message.success(i18next.t('role_created'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editRole = useCallback(
    async (fields: T_RoleFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.EDIT_USER_ROLE;
      const formData = {
        body: JSON.stringify({ ...fields, _id: fields?._id || role?._id }),
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
    [message, role?._id],
  );

  const fetchRoles = useCallback(
    async ({ limit = 1000, skip = 0 }: { limit: number; skip: number }) => {
      const url = API_LINKS.FETCH_USER_ROLES;
      const params = { limit: limit.toString(), skip: skip.toString() };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const _roles = (responseData.roles as T_RawRoleFields[]).map(transformRawRole);

        setRoles(_roles);
        setTempRoles(_roles);
        return _roles;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const fetchRoleById = useCallback(
    async ({ userRoleId, withMetaData = false }: { userRoleId: string; withMetaData: boolean }) => {
      const url = API_LINKS.FETCH_USER_ROLE_BY_ID;
      const params = { userRoleId, withMetaData: withMetaData.toString() };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.role) {
          const _role = transformRawRole(responseData.role, 0);
          setRole(_role);
          return _role;
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

  const deleteRoles = useCallback(
    async (roleIds?: Array<string>) => {
      const url = API_LINKS.DELETE_USER_ROLES;
      const formData = {
        body: JSON.stringify({ roleIds: [...selectedRoleIds, ...(roleIds || [])] }),
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

        setRoles(roles.filter((i) => selectedRoleIds.indexOf(i._id) == -1));

        return responseData.results;
      } catch (err: any) {
        setLoaderStatus(false);

        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message, roles, selectedRoleIds],
  );

  const assignUserRole = useCallback(
    async (userId: string, roleId: string) => {
      const url = API_LINKS.ASSIGN_USER_ROLE;
      const formData: RequestInit = {
        body: JSON.stringify({ userId, roleId }),
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

        message.success(i18next.t('success'));

        return true;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.message ? err.message : ''}`);
        return false;
      }
    },
    [message],
  );

  return {
    selectedRoleIds,
    setSelectedRoleIds,
    createRole,
    fetchRoles,
    roles,
    setRoles,
    fetchRoleById,
    role,
    isLoading,
    editRole,
    tempRoles,
    deleteRoles,
    assignUserRole,
  };
}

export function transformRawRole(item: T_RawRoleFields, index: number): T_RoleFields {
  return {
    ...item,
    key: item._id,
    index: index + 1,
  };
}
