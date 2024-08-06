'use client';

import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateProgramFields, T_FetchPrograms, T_ProgramFields, T_RawProgramFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useProgram = () => {
  const { router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [programs, setPrograms] = useState<Array<T_ProgramFields>>([]);
  const [tempPrograms, setTempPrograms] = useState<Array<T_ProgramFields>>([]);
  const [program, setSProgram] = useState<T_ProgramFields | null>(null);
  const [selectedProgramIds, setSelectedProgramIds] = useState<React.Key[]>([]);

  const createProgram = useCallback(
    async (fields: T_CreateProgramFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.CREATE_PROGRAM;
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

        message.success(i18next.t('program_created'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editProgram = useCallback(
    async (fields: T_ProgramFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.EDIT_PROGRAM;
      const formData = {
        body: JSON.stringify({ ...fields, _id: (program || fields)?._id }),
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

        message.success(i18next.t('success'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message, program],
  );

  const fetchPrograms = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchPrograms) => {
      const url = API_LINKS.FETCH_PROGRAMS;
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

        const _programs = (responseData.programs as T_RawProgramFields[])?.map<T_ProgramFields>(transformRawProgram);

        setPrograms(_programs);
        setTempPrograms(_programs);
        return _programs;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const fetchProgramById = useCallback(
    async ({ programId, withMetaData = false }: { programId: string; withMetaData: boolean }) => {
      const url = API_LINKS.FETCH_PROGRAM_BY_ID;
      const params = { programId, withMetaData: withMetaData.toString() };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.program) {
          const { _id, name, description, school } = responseData.program as T_ProgramFields;

          const _program = {
            _id,
            name,
            description,
            schoolId: school?._id,
          };

          setSProgram(_program as T_ProgramFields);
          return _program;
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
    if (!selectedProgramIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  }, [message, selectedProgramIds.length]);

  const deletePrograms = useCallback(async () => {
    const url = API_LINKS.DELETE_PROGRAMS;
    const formData = {
      body: JSON.stringify({ programIds: selectedProgramIds }),
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

      setPrograms(programs.filter((i) => selectedProgramIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  }, [message, programs, selectedProgramIds]);

  const findProgramsByName = useCallback(
    async ({ withMetaData = false }: { withMetaData: boolean }) => {
      if (isLoading) {
        return message.warning(i18next.t('wait'));
      } else if (!searchQuery.trim().length) {
        return message.warning(i18next.t('search_empty'));
      }

      const url = API_LINKS.FIND_PROGRAMS_BY_NAME;
      const params = {
        name: searchQuery.trim(),
        limit: '1000',
        skip: '0',
        withMetaData: withMetaData.toString(),
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }
        message.success(responseData.programs.length + ' ' + i18next.t('programs_found'));

        setPrograms(responseData.programs);

        return responseData.programs;
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
        setPrograms(tempPrograms);
      }
    },
    [tempPrograms],
  );

  // const triggerEdit = async () => {
  //   if (!selectedProgramIds.length) {
  //     return message.warning(i18next.t('select_item'));
  //   } else if (selectedProgramIds.length > 1) {
  //     return message.warning(i18next.t('select_one_item'));
  //   }

  //   router.push(getChildLinkByKey('edit', ADMIN_LINKS.programs) + `?programId=${selectedProgramIds[0]}`);
  // };

  return {
    createProgram,
    fetchPrograms,
    programs,
    setPrograms,
    setSelectedProgramIds,
    selectedProgramIds,
    triggerDelete,
    // triggerEdit,
    fetchProgramById,
    router,
    program,
    isLoading,
    editProgram,
    findProgramsByName,
    onSearchQueryChange,
    searchQuery,
    tempPrograms,
    deletePrograms,
  };
};

export function transformRawProgram(i: T_RawProgramFields, index: number): T_ProgramFields {
  return {
    index: index + 1,
    key: i._id,
    _id: i._id,
    name: i.name,
    school: i.school,
    schoolId: i.school?._id,
    schoolName: i.school?.name,
    created_by: i.user?.email,
    created_at: new Date(i.created_at).toDateString(),
    description: i.description,
  };
}

export default useProgram;
