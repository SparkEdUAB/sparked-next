'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
import { T_CreateTopicFields, T_FetchTopic, T_TopicFields, T_RawTopicFields } from './types';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useTopic = () => {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [topics, setTopics] = useState<Array<T_TopicFields>>([]);
  const [originalTopics, setOriginalTopics] = useState<Array<T_TopicFields>>([]);
  const [topic, setTopic] = useState<T_TopicFields | null>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<React.Key[]>([]);

  const createTopic = useCallback(
    async (fields: T_CreateTopicFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.CREATE_TOPIC;
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        onSuccessfullyDone?.();
        message.success(i18next.t('topic_created'));
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editTopic = useCallback(
    async (fields: T_TopicFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.EDIT_TOPIC;
      const formData = {
        //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
        body: JSON.stringify({ ...topic, ...fields, topicId: (topic || fields)?._id }),
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
    [message, topic],
  );

  const fetchTopics = useCallback(
    async ({ limit = 20, skip = 0 }: T_FetchTopic) => {
      const url = API_LINKS.FETCH_TOPICS;
      const params = {
        limit: limit.toString(),
        skip: skip.toString(),
        withMetaData: 'true',
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const _topics = (responseData.topics as T_RawTopicFields[])?.map<T_TopicFields>(transformRawTopic);

        _topics.sort((a, b) => (a > b ? 1 : -1));

        setTopics(_topics);
        setOriginalTopics(_topics);
        return _topics;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const fetchTopicById = useCallback(
    async ({ topicId, withMetaData = false }: { topicId: string; withMetaData: boolean }) => {
      const url = API_LINKS.FETCH_TOPIC_BY_ID;
      const params = { topicId: topicId.toString(), withMetaData: withMetaData.toString() };

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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.topic) {
          const topic: T_RawTopicFields = responseData.topic;

          const _topic = transformRawTopic(topic, 0);

          setTopic(_topic);
          return _topic;
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

  const fetchTopicsByGradeId = useCallback(
    async ({ gradeId, withMetaData = false }: { gradeId: string; withMetaData?: boolean }) => {
      const url = API_LINKS.FETCH_TOPICS_BY_GRADE_ID;
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.topics) {
          const _topics = (responseData.topics as T_RawTopicFields[])?.map<T_TopicFields>(transformRawTopic);
          setTopics(_topics);
          setOriginalTopics(_topics);
          return _topics;
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

  const fetchTopicsByUnitId = useCallback(
    async ({ unitId, withMetaData = false }: { unitId: string; withMetaData?: boolean }) => {
      const url = API_LINKS.FETCH_TOPICS_BY_UNIT_ID;
      const formData = { unitId, withMetaData: String(withMetaData) };

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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.topics) {
          const _topics = (responseData.topics as T_RawTopicFields[])?.map<T_TopicFields>(transformRawTopic);
          setTopics(_topics);
          setOriginalTopics(_topics);
          return _topics;
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

  const fetchTopicsBySubjectId = useCallback(
    async ({ subjectId, withMetaData = false }: { subjectId: string; withMetaData?: boolean }) => {
      const url = API_LINKS.FETCH_TOPICS_BY_SUBJECT_ID;
      const formData = { subjectId, withMetaData: String(withMetaData) };

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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.topics) {
          const _topics = (responseData.topics as T_RawTopicFields[])?.map<T_TopicFields>(transformRawTopic);
          setTopics(_topics);
          setOriginalTopics(_topics);
          return _topics;
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
    if (!selectedTopicIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  }, [message, selectedTopicIds.length]);

  const deleteTopics = useCallback(
    async (items?: T_TopicFields[]) => {
      const url = API_LINKS.DELETE_TOPICS;
      const formData = {
        body: JSON.stringify({ topicIds: items ? items.map((item) => item._id) : selectedTopicIds }),
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
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        message.success(i18next.t('success'));

        setTopics(topics.filter((i) => selectedTopicIds.indexOf(i._id) == -1));

        return true;
      } catch (err: any) {
        setLoaderStatus(false);

        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message, selectedTopicIds, topics],
  );

  const findTopicsByName = useCallback(
    async ({ withMetaData = false }: { withMetaData: boolean }) => {
      if (isLoading) {
        return message.warning(i18next.t('wait'));
      } else if (!searchQuery.trim().length) {
        return message.warning(i18next.t('search_empty'));
      }

      const url = API_LINKS.FIND_TOPIC_BY_NAME;
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

        if (!resp.ok) {
          message.warning(i18next.t('unknown_error'));
          return false;
        }

        const responseData = await resp.json();

        if (responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }
        message.success(responseData.topics.length + ' ' + i18next.t('topics_found'));

        setTopics(responseData.topics);

        return responseData.topics;
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
        setTopics(originalTopics);
      }
    },
    [originalTopics],
  );

  const triggerEdit = useCallback(async () => {
    if (!selectedTopicIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedTopicIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.topics) + `?topicId=${selectedTopicIds[0]}`);
  }, [getChildLinkByKey, message, router, selectedTopicIds]);

  return {
    createTopic,
    fetchTopics,
    topics,
    setTopics,
    deleteTopics,
    setSelectedTopicIds,
    selectedTopicIds,
    triggerDelete,
    triggerEdit,
    fetchTopicById,
    fetchTopicsByGradeId,
    fetchTopicsBySubjectId,
    fetchTopicsByUnitId,
    router,
    topic,
    isLoading,
    editTopic,
    findTopicsByName,
    onSearchQueryChange,
    searchQuery,
    originalTopics,
  };
};

export function transformRawTopic(i: T_RawTopicFields, index: number): T_TopicFields {
  return {
    index: index + 1,
    key: i._id,
    _id: i._id,
    name: i.name,
    description: i.description,
    // school: i.school,
    unitId: i.unit?._id,
    gradeId: i.grade?._id,
    subjectId: i.subject?._id,
    // schoolId: i.school?._id,
    // courseId: i.course?._id,
    // programId: i.program?._id,
    // schoolName: i.school?.name,
    // programName: i.program?.name,
    // courseName: i.course?.name,
    unitName: i.unit?.name,
    gradeName: i.grade?.name,
    subjectName: i.subject?.name,
    created_by: i.user?.email,
    created_at: new Date(i.created_at).toDateString(),
  };
}

export default useTopic;
