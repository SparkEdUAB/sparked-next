/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { message } from 'antd';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import UiStore from '@state/mobx/uiStore';
import { T_CreateTopicFields, T_FetchTopic, T_TopicFields, T_RawTopicFields } from './types';
import NETWORK_UTILS from 'utils/network';

const useTopic = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [topics, setTopics] = useState<Array<T_TopicFields>>([]);
  const [originalTopics, setOriginalTopics] = useState<Array<T_TopicFields>>([]);
  const [topic, setTopic] = useState<T_TopicFields | null>(null);
  const [selectedTopicIds, setSelectedTopicIds] = useState<React.Key[]>([]);

  useEffect(() => {
    UiStore.confirmDialogStatus && selectedTopicIds.length && deleteTopics();
  }, [UiStore.confirmDialogStatus]);

  const createTopic = async (fields: T_CreateTopicFields, onSuccessfullyDone?: () => void) => {
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
        message.warning(responseData.code);
        return false;
      }

      onSuccessfullyDone?.();
      message.success(i18next.t('topic_created'));
    } catch (err: any) {
      setLoaderStatus(false);
      console.log('createTopic:errr', err);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editTopic = async (fields: T_TopicFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_TOPIC;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({ ...topic, ...fields, topicId: topic?._id }),
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

  const fetchTopics = async ({ limit = 20, skip = 0 }: T_FetchTopic) => {
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
        message.warning(responseData.code);
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
  };

  const fetchTopicById = async ({ topicId, withMetaData = false }: { topicId: string; withMetaData: boolean }) => {
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
        message.warning(responseData.code);
        return false;
      }

      if (responseData.topic) {
        const topic: T_RawTopicFields = responseData.topic;

        const _topic = transformRawTopic(topic, 0);

        setTopic(_topic);
        form && form.setFieldsValue(_topic);
        return _topic;
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
    if (!selectedTopicIds.length) {
      return message.warning(i18next.t('select_items'));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deleteTopics = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_TOPICS;
    const formData = {
      body: JSON.stringify({ topicIds: selectedTopicIds }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoaderStatus(true);
      UiStore.setLoaderStatus(true);
      const resp = await fetch(url, formData);
      setLoaderStatus(false);
      UiStore.setLoaderStatus(false);

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

      setTopics(topics.filter((i) => selectedTopicIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      setLoaderStatus(false);
      UiStore.setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const findTopicsByName = async ({ withMetaData = false }: { withMetaData: boolean }) => {
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
        message.warning(responseData.code);
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
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setTopics(originalTopics);
    }
  };

  const triggerEdit = async () => {
    if (!selectedTopicIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedTopicIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.topics) + `?topicId=${selectedTopicIds[0]}`);
  };

  return {
    createTopic,
    fetchTopics,
    topics,
    setTopics,
    deleteTopics,
    setSelectedTopicIds,
    selectedTopicIds: selectedTopicIds,
    triggerDelete,
    triggerEdit,
    fetchTopicById,
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
    school: i.school,
    unitId: i.unit?._id,
    schoolId: i.school?._id,
    courseId: i.course?._id,
    programId: i.program?._id,
    schoolName: i.school?.name,
    programName: i.program?.name,
    courseName: i.course?.name,
    unitName: i.unit?.name,
    created_by: i.user?.email,
    created_at: new Date(i.created_at).toDateString(),
  };
}

export default useTopic;
