import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useToastMessage } from 'providers/ToastMessageContext';
import { useState } from 'react';
import NETWORK_UTILS from 'utils/network';
import { T_CreatePageActionFields, T_PageActionFields } from './types';

export function usePageActions() {
  const message = useToastMessage();

  const [selectedPageActionIds, setSelectedPageActionIds] = useState<React.Key[]>([]);
  const [isLoading, setLoaderStatus] = useState<boolean>(false);
  const [tempPageActions, setTempPageActions] = useState<Array<T_PageActionFields>>([]);
  const [pageActions, setPageActions] = useState<Array<T_PageActionFields>>([]);
  const [pageAction, setPageAction] = useState<T_PageActionFields | null>(null);

  const createPageAction = async (fields: T_CreatePageActionFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.CREATE_PAGE_ACTION;
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

      message.success(i18next.t('pageAction_created'));
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const editPageAction = async (fields: T_PageActionFields, onSuccessfullyDone?: () => void) => {
    const url = API_LINKS.EDIT_PAGE_ACTION;
    const formData = {
      body: JSON.stringify({ ...fields, _id: fields?._id || pageAction?._id }),
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

  const fetchPageActions = async ({ limit = 1000, skip = 0 }: { limit: number; skip: number }) => {
    const url = API_LINKS.FETCH_PAGE_ACTION;
    const params = { limit: limit.toString(), skip: skip.toString() };

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

      const _pageActions = responseData.pageActions as T_PageActionFields[];

      setPageActions(_pageActions);
      setTempPageActions(_pageActions);
      return _pageActions;
    } catch (err: any) {
      setLoaderStatus(false);
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const deletePageActions = async () => {
    const url = API_LINKS.DELETE_PAGE_ACTION;
    const formData = {
      body: JSON.stringify({ pageActionIds: selectedPageActionIds }),
      method: 'delete',
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

      setPageActions(pageActions.filter((i) => selectedPageActionIds.indexOf(i._id) == -1));

      return responseData.results;
    } catch (err: any) {
      setLoaderStatus(false);

      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  return {
    selectedPageActionIds,
    setSelectedPageActionIds,
    createPageAction,
    fetchPageActions,
    pageActions,
    setPageActions,
    pageAction,
    isLoading,
    editPageAction,
    tempPageActions,
    deletePageActions,
  };
}