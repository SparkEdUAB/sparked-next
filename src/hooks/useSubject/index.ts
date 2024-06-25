'use client';

import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useState } from 'react';
import { T_CreateSubjectFields, T_FetchSubjects, T_SubjectFields, T_RawSubjectFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';

const useSubject = () => {
  const { router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [subjects, setSubjects] = useState<Array<T_SubjectFields>>([]);
  const [originalSubjects, setOriginalSubjects] = useState<Array<T_SubjectFields>>([]);
  const [subject, setSubject] = useState<T_SubjectFields | null>(null);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<React.Key[]>([]);

  const createSubject = async (fields: T_CreateSubjectFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.CREATE_SUBJECT;
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
      message.success(i18next.t('subject_created'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editSubject = async (fields: T_SubjectFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_SUBJECT;
    const formData = {
      //spread subject in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...subject, ...fields, subjectId: (subject || fields)?._id }),
      method: 'put',
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

  const fetchSubjects = async ({ limit = 1000, skip = 0 }: T_FetchSubjects) => {
    const url = API_LINKS.FETCH_SUBJECTS;
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
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }

      const _subjects = responseData.subjects?.map(transformRawSubject);

      setSubjects(_subjects);
      setOriginalSubjects(_subjects);
      return _subjects;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchSubjectById = async ({
    subjectId,
    withMetaData = false,
  }: {
    subjectId: string;
    withMetaData: boolean;
  }) => {
    const url = API_LINKS.FETCH_SUBJECT_BY_ID;
    const params = { subjectId: subjectId.toString(), withMetaData: withMetaData.toString() };

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

      if (responseData.subject) {
        const _subject = responseData.subject as T_RawSubjectFields;

        setSubject(transformRawSubject(_subject));
        return _subject;
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
    if (!selectedSubjectIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  };

  const deleteSubject = async (items?: T_SubjectFields[]) => {
    const url = API_LINKS.DELETE_SUBJECTS;
    const formData = {
      body: JSON.stringify({ subjectIds: items ? items.map((item) => item._id) : selectedSubjectIds }),
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

      setSubjects(subjects.filter((i) => selectedSubjectIds.indexOf(i._id) == -1));

      return true;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const fetchSubjectsByGradeId = async ({
    gradeId,
    withMetaData = false,
  }: {
    gradeId: string;
    withMetaData?: boolean;
  }) => {
    const url = API_LINKS.FETCH_SUBJECTS_BY_GRADE_ID;
    const formData = { gradeId, withMetaData: String(withMetaData) };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url + NETWORK_UTILS.formatGetParams(formData));
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

      if (responseData.subjects) {
        const _subjects = (responseData.subjects as T_RawSubjectFields[])?.map<T_SubjectFields>(transformRawSubject);
        setSubjects(_subjects);
        setOriginalSubjects(_subjects);
        return _subjects;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const findSubjectByName = async () => {
    if (isLoading) {
      return message.warning(i18next.t('wait'));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t('search_empty'));
    }

    const url = API_LINKS.FIND_SUBJECT_BY_NAME;

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
        message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
        return false;
      }
      message.success(responseData.subjects.length + ' ' + i18next.t('subjects_found'));

      const _subjects = (responseData.subjects as T_RawSubjectFields[]).map(transformRawSubject);
      setSubjects(_subjects);

      return _subjects;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setSubjects(originalSubjects);
    }
  };

  const triggerEdit = async () => {
    if (!selectedSubjectIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedSubjectIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    // TODO: Add the correct link
    // router.push(getChildLinkByKey('edit', '') + `?subjectId=${selectedSubjectIds[0]}`);
  };

  return {
    createSubject,
    fetchSubjects,
    fetchSubjectsByGradeId,
    subjects,
    setSubjects,
    setSelectedSubjectIds,
    selectedSubjectIds,
    triggerDelete,
    triggerEdit,
    fetchSubjectById,
    router,
    subject,
    isLoading,
    editSubject,
    findSubjectByName,
    onSearchQueryChange,
    searchQuery,
    originalSubjects,
    deleteSubject,
  };
};

export function transformRawSubject(subject: T_RawSubjectFields, index: number = 0): T_SubjectFields {
  return {
    index: index + 1,
    key: subject._id,
    _id: subject._id,
    // @ts-expect-error
    gradeId: subject.gradeId,
    gradeName: subject.grade?.name,
    name: subject.name,
    description: subject.description,
    created_by: subject.user?.email,
    created_at: new Date(subject.created_at).toDateString(),
  };
}

export default useSubject;
