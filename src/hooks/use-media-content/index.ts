'use client';

import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useNavigation from '@hooks/useNavigation';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useCallback, useState } from 'react';
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
  const [tempMediaContent, setTempMediaContent] = useState<Array<T_MediaContentFields>>([]);
  const [targetMediaContent, setTargetMediaContent] = useState<T_MediaContentFields | null>(null);
  const [selectedMediaContentIds, setSelectedMediaContentIds] = useState<T_React_key[]>([]);

  const createResource = useCallback(
    async (fields: T_CreateResourceFields, fileUrl: string, thumbnailUrl?: string, onSuccessfullyDone?: () => void) => {
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        onSuccessfullyDone?.();
        message.success(i18next.t('resource_created'));
        return true;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editMediaContent = useCallback(
    async (fields: T_MediaContentFields, fileUrl?: string, thumbnailUrl?: string, onSuccessfullyDone?: () => void) => {
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
    [message, targetMediaContent],
  );

  const fetchMediaContent = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchTopic) => {
      const url = API_LINKS.FETCH_MEDIA_CONTENT;
      const params = { limit: `${limit}`, skip: `${skip}`, withMetaData: 'true' };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
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
    },
    [message],
  );

  const fetchMediaContentTypes = useCallback(
    async ({ limit = 1000, skip = 0 }: T_FetchTopic) => {
      const url = API_LINKS.FETCH_MEDIA_TYPES;
      const params = { limit: `${limit}`, skip: `${skip}`, withMetaData: 'true' };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));
        setLoaderStatus(false);

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        const _mediaContentTypes = (responseData.mediaContents as T_RawMediaContentFields[])?.map<T_MediaContentFields>(
          transformRawMediaContent,
        );

        setMediaContentTypes(_mediaContentTypes);
        return _mediaContentTypes;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const fetchMediaContentById = useCallback(
    async ({ mediaContentId, withMetaData = false }: { mediaContentId: string; withMetaData: boolean }) => {
      const url = API_LINKS.FETCH_MEDIA_CONTENT_BY_ID;
      const params = { mediaContentId, withMetaData: `${withMetaData}` };

      try {
        setLoaderStatus(true);
        const resp = await fetch(url + NETWORK_UTILS.formatGetParams(params));

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        if (responseData.mediaContent) {
          const rawMediaContent = responseData.mediaContent as T_RawMediaContentFields;
          const _mediaContent = transformRawMediaContent(rawMediaContent, 0);
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
    },
    [message],
  );

  const triggerDelete = useCallback(async () => {
    if (!selectedMediaContentIds.length) {
      return message.warning(i18next.t('select_items'));
    }
  }, [message, selectedMediaContentIds.length]);

  const deleteMediaContent = useCallback(
    async (items?: T_MediaContentFields[]) => {
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
          message.warning(getProcessCodeMeaning(responseData.code));
          return false;
        }

        message.success(i18next.t('success'));

        const newMediaContentIds = mediaContent.filter((i) => selectedMediaContentIds.indexOf(i._id) == -1);

        setMediaContent(newMediaContentIds);

        return true;
      } catch (err: any) {
        setLoaderStatus(false);

        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [mediaContent, message, selectedMediaContentIds],
  );

  const findMediaContentByName = useCallback(
    async ({ withMetaData = false, searchText }: { withMetaData?: boolean; searchText?: string }) => {
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

        const responseData = await resp.json();

        if (!resp.ok || responseData.isError) {
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
    },
    [isLoading, message, searchQuery],
  );

  const onSearchQueryChange = useCallback(
    (text: string) => {
      setSearchQuery(text);

      if (!text.trim().length) {
        setMediaContent(tempMediaContent);
      }
    },
    [tempMediaContent],
  );

  const triggerEdit = useCallback(async () => {
    if (!selectedMediaContentIds.length) {
      return message.warning(i18next.t('select_item'));
    } else if (selectedMediaContentIds.length > 1) {
      return message.warning(i18next.t('select_one_item'));
    }

    router.push(getChildLinkByKey('edit', ADMIN_LINKS.media_content) + `?mediaContentId=${selectedMediaContentIds[0]}`);
  }, [getChildLinkByKey, message, router, selectedMediaContentIds]);

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
    gradeId: i.course?._id,
    subjectId: i.course?._id,
    schoolId: i.school?._id,
    unitId: i.unit?._id,
    programId: i.program?._id,
    topicId: i.topic?._id,

    schoolName: i.school?.name,
    programName: i.program?.name,
    courseName: i.course?.name,
    gradeName: i.course?.name,
    subjectName: i.course?.name,
    unitName: i.unit?.name,
    topicName: i.topic?.name,

    school: i.school,
    created_by: i.user?.email,
    created_at: new Date(i.created_at as string).toDateString(),
  };
}

export default useMediaContent;
