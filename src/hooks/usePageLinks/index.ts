import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useToastMessage } from 'providers/ToastMessageContext';
import { useCallback, useState } from 'react';
import NETWORK_UTILS from 'utils/network';
import { T_CreatePageLinkFields, T_PageLinkFields, T_RawPageLinkFields } from './types';
import getProcessCodeMeaning from 'utils/helpers/getProcessCodeMeaning';

export function usePageLinks() {
  const message = useToastMessage();

  const [selectedPageLinkIds, setSelectedPageLinkIds] = useState<React.Key[]>([]);
  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [tempPageLinks, setTempPageLinks] = useState<Array<T_PageLinkFields>>([]);
  const [pageLinks, setPageLinks] = useState<Array<T_PageLinkFields>>([]);

  const createPageLink = useCallback(
    async (fields: T_CreatePageLinkFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.CREATE_PAGE_LINK;
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

        message.success(i18next.t('pageLink_created'));
        return true;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const editPageLink = useCallback(
    async (fields: T_PageLinkFields, onSuccessfullyDone?: () => void) => {
      const url = API_LINKS.EDIT_PAGE_LINK;
      const formData = {
        body: JSON.stringify({ ...fields, _id: fields._id }),
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
    [message],
  );

  const fetchPageLinks = useCallback(
    async ({ limit = 1000, skip = 0 }: { limit: number; skip: number }) => {
      const url = API_LINKS.FETCH_PAGE_LINKS;
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

        const _pageLinks = (responseData.pageLinks as T_RawPageLinkFields[]).map(transformRawPageLink);

        setPageLinks(_pageLinks);
        setTempPageLinks(_pageLinks);
        return _pageLinks;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const deletePageLinks = useCallback(
    async (pageIds?: Array<string>) => {
      const url = API_LINKS.DELETE_PAGE_LINK;
      const formData = {
        body: JSON.stringify({ pageLinkIds: [...selectedPageLinkIds, ...(pageIds || [])] }),
        method: 'delete',
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

        setPageLinks(pageLinks.filter((i) => selectedPageLinkIds.indexOf(i._id) == -1));

        return responseData.results;
      } catch (err: any) {
        setLoaderStatus(false);

        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message, pageLinks, selectedPageLinkIds],
  );

  const assignPageLinkToPageLink = useCallback(
    async (pageLinkId: string, pageActionId: string) => {
      const url = API_LINKS.ASSIGN_PAGE_ACTION_TO_PAGE_LINK;
      const formData = {
        body: JSON.stringify({ pageLinkId, pageActionId }),
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
        return true;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  const unAssignPageLinkToPageLink = useCallback(
    async (pageLinkId: string, pageActionId: string) => {
      const url = API_LINKS.UNASSIGN_PAGE_ACTION_TO_PAGE_LINK;
      const formData = {
        body: JSON.stringify({ pageLinkId, pageActionId }),
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
        return true;
      } catch (err: any) {
        setLoaderStatus(false);
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  return {
    selectedPageLinkIds,
    setSelectedPageLinkIds,
    createPageLink,
    fetchPageLinks,
    pageLinks,
    setPageLinks,
    isLoading,
    editPageLink,
    tempPageLinks,
    deletePageLinks,
    assignPageLinkToPageLink,
    unAssignPageLinkToPageLink,
  };
}

export function transformRawPageLink(item: T_RawPageLinkFields, index: number): T_PageLinkFields {
  return {
    ...item,
    key: item._id,
    index: index + 1,
  };
}
