'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateUnitFields, T_FetchUnits, T_RawUnitFields, T_UnitFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useUnit = () => {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [units, setUnits] = useState<Array<T_UnitFields>>([]);
  const [tempUnits, setTempUnits] = useState<Array<T_UnitFields>>([]);
  const [unit, setUnit] = useState<T_UnitFields | null>(null);
  const [selectedUnitIds, setSelectedProgramIds] = useState<React.Key[]>([]);

  const createUnit = useCallback(
    async (fields: T_CreateUnitFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.CREATE_UNIT;
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
        message.success(i18next.t('unit_created'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editUnit = useCallback(
    async (fields: T_UnitFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.EDIT_UNIT;
      const formData = {
        //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
        body: JSON.stringify({ ...unit, ...fields, unitId: (unit || fields)?._id }),
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
    [message, unit],
  );

  const fetchUnits = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchUnits) => {
      const url = API_LINKS.FETCH_UNITS;
      const formData = { limit: limit.toString(), skip: skip.toString(), withMetaData: 'true' };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(formData));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const _units = (responseData.units as T_RawUnitFields[])?.map<T_UnitFields>(transformRawUnit);

        setUnits(_units);
        setTempUnits(_units);
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
      const formData = { unitId, withMetaData: withMetaData.toString() };

      try {
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(formData));

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.unit) {
          const _unit = transformRawUnit(responseData.unit, 0);
          setUnit(_unit);
          return _unit;
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

  const fetchUnitsBySubjectId = useCallback(
    async ({ subjectId, withMetaData = false }: { subjectId: string; withMetaData?: boolean }) => {
      const url = API_LINKS.FETCH_UNITS_BY_SUBJECT_ID;
      const formData = { subjectId, withMetaData: String(withMetaData) };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(formData));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.units) {
          const _units = (responseData.units as T_RawUnitFields[])?.map<T_UnitFields>(transformRawUnit);
          setUnits(_units);
          setTempUnits(_units);
          return _units;
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

  const fetchUnitsByTopicId = useCallback(
    async ({ topicId, withMetaData = false }: { topicId: string; withMetaData?: boolean }) => {
      const url = API_LINKS.FETCH_UNITS_BY_TOPIC_ID;
      const formData = { topicId, withMetaData: String(withMetaData) };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(formData));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.units) {
          const _units = (responseData.units as T_RawUnitFields[])?.map<T_UnitFields>(transformRawUnit);
          setUnits(_units);
          setTempUnits(_units);
          return _units;
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
    if (!selectedUnitIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  }, [message, selectedUnitIds.length]);

  const deleteUnits = useCallback(
    async (items?: T_UnitFields[]) => {
      const url = API_LINKS.DELETE_UNITS;
      const formData = {
        body: JSON.stringify({ unitIds: items ? items.map((item) => item._id) : selectedUnitIds }),
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

        setUnits(units.filter((i) => selectedUnitIds.indexOf(i._id) == -1));

        return true;
      } catch (err: any) {
        setLoaderStatus(false);

        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message, selectedUnitIds, units],
  );

  const findUnitsByName = useCallback(
    async ({ withMetaData = false }: { withMetaData: boolean }) => {
      if (isLoading) {
        return message.warning(i18next.t('wait'));
      } else if (!searchQuery.trim().length) {
        return message.warning(i18next.t('search_empty'));
      }

      const url = API_LINKS.FIND_UNITS_BY_NAME;
      const formData = {
        name: searchQuery.trim(),
        limit: '1000',
        skip: '0',
        withMetaData: withMetaData.toString(),
      };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(formData));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }
        message.success(responseData.courses.length + ' ' + i18next.t('units_found'));

        setUnits(responseData.courses);

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
        setUnits(tempUnits);
      }
    },
    [tempUnits],
  );

  const triggerEdit = useCallback(async () => {
    if (!selectedUnitIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedUnitIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${selectedUnitIds[0]}`);
  }, [getChildLinkByKey, message, router, selectedUnitIds]);

  return {
    createUnit,
    fetchUnits,
    units,
    setUnits,
    setSelectedProgramIds,
    selectedUnitIds,
    triggerDelete,
    triggerEdit,
    fetchUnitById,
    fetchUnitsBySubjectId,
    fetchUnitsByTopicId,
    router,
    unit,
    isLoading,
    editUnit,
    findUnitsByName,
    onSearchQueryChange,
    searchQuery,
    tempUnits,
    deleteUnits,
  };
};

export function transformRawUnit(i: T_RawUnitFields, index: number): T_UnitFields {
  return {
    index: index + 1,
    key: i._id,
    _id: i._id,
    name: i.name,
    description: i.description,
    schoolId: i.school?._id,
    programId: i.program?._id,
    courseId: i.course?._id,
    subjectId: i.course?._id,
    gradeId: i.course?._id,
    schoolName: i.school?.name,
    programName: i.program?.name,
    courseName: i.course?.name,
    subjectName: i.subject?.name,
    gradeName: i.subject?.name,
    created_by: i.user?.email,
    created_at: new Date(i.created_at).toDateString(),
    school: i.school,
    course: i.course,
    program: i.program,
    user: i.user,
  };
}

export default useUnit;
