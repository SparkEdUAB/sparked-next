/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { FormInstance, message } from 'antd';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import UiStore from '@state/mobx/uiStore';
import { T_CreateUnitFields, T_FetchUnits, T_RawUnitFields, T_UnitFields } from './types';

const useUnit = (form?: FormInstance) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [units, setUnits] = useState<Array<T_UnitFields>>([]);
  const [tempUnits, setTempUnits] = useState<Array<T_UnitFields>>([]);
  const [unit, setUnit] = useState<T_UnitFields | null>(null);
  const [selectedUnitIds, setSelectedProgramIds] = useState<React.Key[]>([]);

  useEffect(() => {
    UiStore.confirmDialogStatus && selectedUnitIds.length && deleteUnits();
  }, [UiStore.confirmDialogStatus]);

  const createUnit = async (fields: T_CreateUnitFields, onSuccessfullyDone?: () => void) => {
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
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editUnit = async (fields: T_UnitFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_UNIT;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...unit, ...fields, unitId: unit?._id }),
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

      onSuccessfullyDone?.();
      message.success(i18next.t('success'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchUnits = async ({ limit = 1000, skip = 0 }: T_FetchUnits) => {
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

      const _units = (responseData.units as T_RawUnitFields[])?.map<T_UnitFields>((i, index: number) => ({
        index: index + 1,
        key: i._id,
        _id: i._id,
        name: i.name,
        description: i.description,

        schoolId: i.school?._id,
        programId: i.program?._id,
        courseId: i.course?._id,

        schoolName: i.school?.name,
        programName: i.program?.name,
        courseName: i.course?.name,

        created_by: i.user?.email,
        created_at: new Date(i.created_at).toDateString(),

        school: i.school,
        course: i.course,
        program: i.program,
        user: i.user,
      }));

      setUnits(_units);
      setTempUnits(_units);
      return _units;
    } catch (err: any) {
      setLoaderStatus(false);
      console.log(err);
      console.error(err);
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
        const { _id, name, description, school, program, course } = responseData.unit as T_UnitFields;

        const _unit = {
          _id,
          name,
          description,
          schoolId: school?._id,
          programId: program?._id,
          courseId: course?._id,
        };

        setUnit(_unit as T_UnitFields);
        form && form.setFieldsValue(_unit);
        return _unit;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const triggerDelete = async () => {
    if (!selectedUnitIds.length) {
      return message.warning(i18next.t('select_items'));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deleteUnits = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_UNITS;
    const formData = {
      body: JSON.stringify({ unitIds: selectedUnitIds }),
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

      setUnits(units.filter((i) => selectedUnitIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      UiStore.setLoaderStatus(false);
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const findUnitsByName = async ({ withMetaData = false }: { withMetaData: boolean }) => {
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

      setUnits(responseData.courses);

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
      setUnits(tempUnits);
    }
  };

  const triggerEdit = async () => {
    if (!selectedUnitIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedUnitIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.units) + `?unitId=${selectedUnitIds[0]}`);
  };

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

export default useUnit;
