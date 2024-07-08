/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { T_CreateResourceFields, T_FetchTopic } from './types';
import { T_RawMediaContentFields, T_MediaContentFields } from 'types/media-content';
import { T_React_key } from 'types/navigation';
import NETWORK_UTILS from 'utils/network';
import { useToastMessage } from 'providers/ToastMessageContext';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

const useMediaContent = () => {
  const { getChildLinkByKey, router } = useNavigation();
  const message = useToastMessage();

  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mediaContent, setMediaContent] = useState<Array<T_MediaContentFields>>([]);
  const [mediaContentTypes, setMediaContentTypes] = useState<Array<T_MediaContentFields>>([]);
  const [tempMediaContentTypes, setTempMediaContentTypes] = useState<Array<T_MediaContentFields>>([]);
  const [tempMediaContent, setTempMediaContent] = useState<Array<T_MediaContentFields>>([]);
  const [targetMediaContent, setTargetMediaContent] = useState<T_MediaContentFields | null>(null);
  const [selectedMediaContentIds, setSelectedMediaContentIds] = useState<T_React_key[]>([]);

  const createResource = async (
    fields: T_CreateResourceFields,
    fileUrl: string,
    thumbnailUrl?: string,
    onSuccessfullyDone?: () => void,
  ) => {
    const url = API_LINKS.CREATE_MEDIA_CONTENT;
    const formData = {
      body: JSON.stringify({ ...fields, fileUrl: fileUrl, file_url: fileUrl, thumbnailUrl }),
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
      message.success(i18next.t('media_content_created'));
      return true;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editMediaContent = async (
    fields: T_MediaContentFields,
    fileUrl?: string,
    thumbnailUrl?: string,
    onSuccessfullyDone?: () => void,
  ) => {
    const url = API_LINKS.EDIT_MEDIA_CONTENT;
    const formData = {
      //spread course in an event that it is not passed by the form due to the fact that the first 1000 records didn't contain it. See limit on fetch schools and programs
      body: JSON.stringify({
        ...targetMediaContent,
        ...fields,
        mediaContentId: fields?._id,
        fileUrl: fileUrl ? fileUrl : fields?.fileUrl,
        file_url: fileUrl ? fileUrl : fields?.fileUrl,
        thumbnailUrl: thumbnailUrl ? thumbnailUrl : fields?.thumbnailUrl,
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
  };

  const fetchMediaContent = async ({ limit = 1000, skip = 0 }: T_FetchTopic) => {
    const url = API_LINKS.FETCH_MEDIA_CONTENT;
    const params = { limit: `${limit}`, skip: `${skip}`, withMetaData: 'true' };

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

      const _mediaContent = (responseData.mediaContent as T_RawMediaContentFields[])?.map<T_MediaContentFields>(
        transformRawMediaContent,
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

  const fetchMediaContentTypes = async ({ limit = 1000, skip = 0 }: T_FetchTopic) => {
    const url = API_LINKS.FETCH_MEDIA_TYPES;
    const params = { limit: `${limit}`, skip: `${skip}`, withMetaData: 'true' };

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

      const _mediaContentTypes = (responseData.mediaContents as T_RawMediaContentFields[])?.map<T_MediaContentFields>(
        transformRawMediaContent,
      );

      setMediaContentTypes(_mediaContentTypes);
      setTempMediaContentTypes(_mediaContentTypes);
      return _mediaContentTypes;
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
    const params = { mediaContentId, withMetaData: `${withMetaData}` };

    try {
      setLoaderStatus(true);
      const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(getProcessCodeMeaning(responseData.code));
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
          courseName: mediaContent.course?.name,
          schoolName: mediaContent.school?.name,
          programName: mediaContent.program?.name,
          unitName: mediaContent.unit?.name,
          topicName: mediaContent.topic?.name,
          fileUrl: mediaContent.file_url || undefined,
          file_url: mediaContent.file_url,
          thumbnailUrl: mediaContent.thumbnailUrl,
          updated_at: mediaContent.updated_at,
        };

        setTargetMediaContent(_mediaContent);
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
  };

  const deleteMediaContent = async (items?: T_MediaContentFields[]) => {
    const url = API_LINKS.DELETE_MEDIA_CONTENT;
    const formData = {
      body: JSON.stringify({ mediaContentIds: items ? items.map((item) => item._id) : selectedMediaContentIds }),
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

      const newMediaContentIds = mediaContent.filter((i) => selectedMediaContentIds.indexOf(i._id) == -1);

      setMediaContent(newMediaContentIds);

      // setTargetMediaContent(newMediaContentIds);

      return true;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };
  const findMediaContentByName = async ({
    withMetaData = false,
    searchText,
  }: {
    withMetaData?: boolean;
    searchText?: string;
  }) => {
    if (isLoading) {
      return message.warning(i18next.t('wait'));
    } else if (!searchQuery.trim().length && (!searchText || !searchText.trim().length)) {
      return message.warning(i18next.t('search_empty'));
    }

    const url = API_LINKS.FIND_MEDIA_CONTENT_BY_NAME;
    const params = {
      name: (searchQuery || searchText || '').trim(),
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
    fetchMediaContentTypes,
    mediaContent,
    mediaContentTypes,
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

export function transformRawMediaContent(i: T_RawMediaContentFields, index: number): T_MediaContentFields {
  return {
    index: index + 1,
    key: i._id,
    _id: i._id,
    name: i.name,
    fileUrl: i.file_url || undefined,
    thumbnailUrl: i.thumbnailUrl,
    description: i.description,
    courseId: i.course?._id,
    school: i.school,
    schoolId: i.school?._id,
    unitId: i.unit?._id,
    schoolName: i.school?.name,
    programName: i.program?.name,
    courseName: i.course?.name,
    unitName: i.unit?.name,
    programId: i.program?._id,
    topicId: i.topic?._id,
    topicName: i.topic?.name,
    created_by: i.user?.email,
    created_at: new Date(i.created_at as string).toDateString(),
  };
}

export default useMediaContent;
