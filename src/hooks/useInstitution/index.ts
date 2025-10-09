'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateInstitutionFields, T_FetchInstitutions, T_RawInstitutionFields, T_InstitutionFields, T_PublicInstitution } from './types';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

function transformRawInstitution(institution: T_RawInstitutionFields, index: number): T_InstitutionFields {
  return {
    index: index + 1,
    key: institution._id,
    _id: institution._id,
    name: institution.name,
    description: institution.description,
    type: institution.type,
    logo: institution.logo,
    website: institution.website,
    address: institution.address,
    contact_email: institution.contact_email,
    contact_phone: institution.contact_phone,
    is_verified: institution.is_verified,
    created_by: institution.user?.email || '',
    created_at: new Date(institution.created_at).toDateString(),
    updated_at: institution.updated_at ? new Date(institution.updated_at).toDateString() : undefined,
    user: institution.user,
  };
}

export default function useInstitution() {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [institutions, setInstitutions] = useState<Array<T_InstitutionFields>>([]);
  const [tempInstitutions, setTempInstitutions] = useState<Array<T_InstitutionFields>>([]);
  const [institution, setInstitution] = useState<T_InstitutionFields | null>(null);
  const [selectedInstitutionIds, setSelectedInstitutionIds] = useState<React.Key[]>([]);
  const [publicInstitutions, setPublicInstitutions] = useState<Array<T_PublicInstitution>>([]);

  const createInstitution = useCallback(
    async (fields: T_CreateInstitutionFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.CREATE_INSTITUTION;
      const formData = {
        body: JSON.stringify({ ...fields }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        message.success(i18next.t('institution_created_successfully'));
        onSuccessfullyDone?.();
        return responseData;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoaderStatus(false);
      }
    },
    [message],
  );

  const fetchInstitutions = useCallback(
    async (options: T_FetchInstitutions = {}) => {
      const { limit = 20, skip = 0 } = options;

      const url = API_LINKS.FETCH_INSTITUTIONS;
      const formData = {
        body: JSON.stringify({ limit, skip }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const _institutions = responseData.institutions?.map(
          (i: T_RawInstitutionFields, index: number) => transformRawInstitution(i, index)
        ) || [];

        setInstitutions(_institutions);
        setTempInstitutions(_institutions);
        return _institutions;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoaderStatus(false);
      }
    },
    [message],
  );

  const fetchInstitution = useCallback(
    async (institutionId: string) => {
      const url = API_LINKS.FETCH_INSTITUTION;
      const formData = {
        body: JSON.stringify({ institutionId }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.institution) {
          const transformedInstitution = transformRawInstitution(responseData.institution, 0);
          setInstitution(transformedInstitution);
          return transformedInstitution;
        }

        return null;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoaderStatus(false);
      }
    },
    [message],
  );

  const fetchPublicInstitutions = useCallback(
    async (search?: string, limit = 50) => {
      const url = API_LINKS.FETCH_PUBLIC_INSTITUTIONS;
      const formData = {
        body: JSON.stringify({ search, limit }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          console.error('Error fetching public institutions:', responseData.code);
          return [];
        }

        const institutions = responseData.institutions || [];
        setPublicInstitutions(institutions);
        return institutions;
      } catch (err: any) {
        console.error('Error fetching public institutions:', err);
        return [];
      }
    },
    [],
  );

  const deleteInstitutions = useCallback(
    async () => {
      if (!selectedInstitutionIds.length) {
        return message.warning(i18next.t('select_item'));
      }

      const url = API_LINKS.DELETE_INSTITUTIONS;
      const formData = {
        body: JSON.stringify({ institutionIds: selectedInstitutionIds }),
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        message.success(i18next.t('institutions_deleted_successfully'));
        // Refresh the list
        await fetchInstitutions();
        setSelectedInstitutionIds([]);
        return true;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoaderStatus(false);
      }
    },
    [selectedInstitutionIds, message, fetchInstitutions],
  );

  const approveInstitution = useCallback(
    async (institutionId: string) => {
      const url = API_LINKS.VERIFY_INSTITUTION;
      const formData = {
        body: JSON.stringify({ 
          institutionId,
          action: 'approve' 
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code) || responseData.message);
          return false;
        }

        message.success(i18next.t('institution_approved'));
        return true;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoaderStatus(false);
      }
    },
    [message],
  );

  const rejectInstitution = useCallback(
    async (institutionId: string, rejectionReason?: string) => {
      const url = API_LINKS.VERIFY_INSTITUTION;
      const formData = {
        body: JSON.stringify({ 
          institutionId,
          action: 'reject',
          rejectionReason 
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url, formData);
        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code) || responseData.message);
          return false;
        }

        message.success(i18next.t('institution_rejected'));
        return true;
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      } finally {
        setLoaderStatus(false);
      }
    },
    [message],
  );

  const onSearchQueryChange = useCallback(
    (text: string) => {
      setSearchQuery(text);

      if (!text.trim().length) {
        setInstitutions(tempInstitutions);
      }
    },
    [tempInstitutions],
  );

  const triggerEdit = useCallback(async () => {
    if (!selectedInstitutionIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedInstitutionIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.institutions) + `?institutionId=${selectedInstitutionIds[0]}`);
  }, [getChildLinkByKey, message, router, selectedInstitutionIds]);

  const triggerDelete = useCallback(async () => {
    return await deleteInstitutions();
  }, [deleteInstitutions]);

  return {
    createInstitution,
    fetchInstitutions,
    fetchInstitution,
    fetchPublicInstitutions,
    institutions,
    setInstitutions,
    setSelectedInstitutionIds,
    selectedInstitutionIds,
    triggerDelete,
    triggerEdit,
    router,
    institution,
    isLoading,
    onSearchQueryChange,
    searchQuery,
    tempInstitutions,
    deleteInstitutions,
    publicInstitutions,
    setPublicInstitutions,
    approveInstitution,
    rejectInstitution,
  };
}

export { transformRawInstitution };