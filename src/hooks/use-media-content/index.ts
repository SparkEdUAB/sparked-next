/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { message } from 'antd';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import UiStore from '@state/mobx/uiStore';
import { T_CreateResourceFields, T_FetchTopic } from './types';
import { T_RawMediaContentFields, T_MediaContentFields } from 'types/media-content';
import { T_React_key } from 'app/types';

const useMediaContent = (form?: any) => {
  const { getChildLinkByKey, router } = useNavigation();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mediaContent, setMediaContent] = useState<Array<T_MediaContentFields>>([]);
  const [tempMediaContent, setTempMediaContent] = useState<Array<T_MediaContentFields>>([]);
  const [targetMediaContent, setTargetMediaContent] = useState<T_MediaContentFields | null>(null);
  const [selectedMediaContentIds, setSelectedMediaContentIds] = useState<T_React_key[]>([]);

  useEffect(() => {
    UiStore.confirmDialogStatus && selectedMediaContentIds.length && deleteMediaContent();
  }, [UiStore.confirmDialogStatus]);

  const createResource = async (fields: T_CreateResourceFields, fileUrl: string, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.CREATE_MEDIA_CONTENT;
    const formData = {
      body: JSON.stringify({ ...fields, fileUrl: fileUrl, file_url: fileUrl }),
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
      message.success(i18next.t('media content created'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editMediaContent = async (fields: T_MediaContentFields, fileUrl?: string, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_MEDIA_CONTENT;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({
        ...targetMediaContent,
        ...fields,
        mediaContentId: targetMediaContent?._id,
        fileUrl: fileUrl ? fileUrl : targetMediaContent?.fileUrl,
        file_url: fileUrl ? fileUrl : targetMediaContent?.fileUrl,
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

      onSuccessfullyDone?.();
      message.success(i18next.t('success'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchMediaContent = async ({ limit = 1000, skip = 0 }: T_FetchTopic) => {
    const url = API_LINKS.FETCH_MEDIA_CONTENT;
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

      const _mediaContent = (responseData.mediaContent as T_RawMediaContentFields[])?.map<T_MediaContentFields>(
        (i, index: number) =>
          ({
            index: index + 1,
            key: i._id,
            _id: i._id,
            name: i.name,
            fileUrl: i.file_url || undefined,
            description: i.description,
            courseId: i.course._id,
            school: i.school,
            schoolId: i.school?._id,
            unitId: i.course?._id,
            schoolName: i.school?.name,
            programName: i.program?.name,
            courseName: i.course?.name,
            unitName: i.unit?.name,
            programId: i.program?._id,
            topicId: i.topic?._id,
            topicName: i.topic?.name,
            created_by: i.user?.email,
            created_at: new Date(i.created_at as string).toDateString(),
          } satisfies T_MediaContentFields),
      );

      setMediaContent(_mediaContent);
      setTempMediaContent(_mediaContent);
      return _mediaContent;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const fetchMediaContentById = async ({
    mediaContentId,
    withMetaData = false,
  }: {
    mediaContentId: string;
    withMetaData: boolean;
  }) => {
    const url = API_LINKS.FETCH_MEDIA_CONTENT_BY_ID;
    const formData = {
      body: JSON.stringify({ mediaContentId, withMetaData }),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      setLoaderStatus(true);
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

      if (responseData.mediaContent) {
        const mediaContent = responseData.mediaContent as T_RawMediaContentFields;

        const _mediaContent = {
          index: 1,
          _id: mediaContent._id,
          key: mediaContent._id,
          name: mediaContent.name,
          description: mediaContent.description,
          schoolId: mediaContent.school?._id,
          programId: mediaContent.program?._id,
          courseId: mediaContent.course?._id,
          unitId: mediaContent.unit?._id,
          topicId: mediaContent.topic?._id,
          courseName: mediaContent.course.name,
          schoolName: mediaContent.school.name,
          programName: mediaContent.program.name,
          unitName: mediaContent.unit.name,
          topicName: mediaContent.topic.name,
          fileUrl: mediaContent.file_url || undefined,
          file_url: mediaContent.file_url,
          updated_at: mediaContent.updated_at,
        };

        setTargetMediaContent(_mediaContent);
        form && form.setFieldsValue(_mediaContent);
        return _mediaContent;
      } else {
        return null;
      }
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    } finally {
      setLoaderStatus(false);
    }
  };

  const triggerDelete = async () => {
    if (!selectedMediaContentIds.length) {
      return message.warning(i18next.t('select_items'));
    }

    UiStore.setConfirmDialogVisibility(true);
  };

  const deleteMediaContent = async () => {
    if (UiStore.isLoading) return;

    const url = API_LINKS.DELETE_MEDIA_CONTENT;
    const formData = {
      body: JSON.stringify({ mediaContentIds: selectedMediaContentIds }),
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

      const newMediaContentIds = mediaContent.filter((i) => selectedMediaContentIds.indexOf(i._id) == -1);

      setMediaContent(newMediaContentIds);

      // setTargetMediaContent(newMediaContentIds);

      return responseData.results;
    } catch (err: any) {
      setLoaderStatus(false);
      UiStore.setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const findMediaContentByName = async ({ withMetaData = false }: { withMetaData: boolean }) => {
    if (isLoading) {
      return message.warning(i18next.t('wait'));
    } else if (!searchQuery.trim().length) {
      return message.warning(i18next.t('search_empty'));
    }

    const url = API_LINKS.FIND_MEDIA_CONTENT_BY_NAME;
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
      message.success(responseData.mediaContent.length + ' ' + i18next.t('media_content_found'));

      setMediaContent(responseData.mediaContent);

      return responseData.mediaContent;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const onSearchQueryChange = (text: string) => {
    setSearchQuery(text);

    if (!text.trim().length) {
      setMediaContent(tempMediaContent);
    }
  };

  const triggerEdit = async () => {
    if (!selectedMediaContentIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedMediaContentIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.media_content) + `?mediaContentId=${selectedMediaContentIds[0]}`);
  };

  return {
    createResource,
    fetchMediaContent,
    mediaContent,
    setMediaContent,
    setSelectedMediaContentIds,
    selectedMediaContentIds,
    triggerDelete,
    triggerEdit,
    fetchMediaContentById,
    router,
    targetMediaContent,
    isLoading,
    editMediaContent,
    findMediaContentByName,
    onSearchQueryChange,
    searchQuery,
    tempMediaContent,
    deleteMediaContent,
  };
};

export default useMediaContent;
