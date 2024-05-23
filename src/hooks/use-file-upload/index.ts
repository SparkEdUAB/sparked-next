/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import useNavigation from '@hooks/useNavigation';
import { AXIOS_PROCESS_STATUS } from '@hooks/useNavigation/constants';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useToastMessage } from 'providers/ToastMessageContext';
import { useState } from 'react';

const useFileUpload = () => {
  const { apiNavigator } = useNavigation();
  const message = useToastMessage();

  const [isUploading, setLoaderStatus] = useState<boolean>(false);

  const uploadFile = async (file: File) => {
    const url = API_LINKS.FILE_UPLOAD;

    const formData = new FormData();

    formData.append('file', file);

    try {
      setLoaderStatus(true);

      const resp = await apiNavigator.post(url, formData);

      if (resp.status !== AXIOS_PROCESS_STATUS.OK.code) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      if (resp.data.isError) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const fileUrl: string = resp.data.url;

      console.log('fileUrl', fileUrl);

      return fileUrl;
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    } finally {
      setLoaderStatus(false);
    }
  };

  return {
    uploadFile,
    isUploading,
  };
};

export default useFileUpload;
