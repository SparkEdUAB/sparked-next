'use client';

import { API_LINKS } from 'app/links';
import sharedConfig from 'app/shared/config';
import i18next from 'i18next';
import { useToastMessage } from 'providers/ToastMessageContext';
import { useCallback, useEffect, useState } from 'react';
import { T_CONFIG, T_CONFIG_VARIABLES } from 'types/config';

const useConfig = (props: T_CONFIG) => {
  const { isAutoLoadCoreConfig } = props;
  const message = useToastMessage();

  const { getDisabledConfigItems } = sharedConfig();

  const [configs, setConfigs] = useState<T_CONFIG_VARIABLES | null>(null);

  const loadConfigFile = useCallback(
    async ({}) => {
      const url = API_LINKS.READ_CONFIG_FILE;

      try {
        const resp = await fetch(url);

        if (!resp.ok) {
          message.warning(i18next.t('unknown_error'));
          return false;
        }

        const responseData = await resp.json();

        if (responseData.isError) {
          message.warning(`${i18next.t('failed_with_error_code')} (${responseData.code})`);
          return false;
        }

        setConfigs(responseData.configData);
      } catch (err: any) {
        message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
        return false;
      }
    },
    [message],
  );

  useEffect(() => {
    isAutoLoadCoreConfig && loadConfigFile({});
  }, [isAutoLoadCoreConfig, loadConfigFile]);

  return {
    loadConfigFile,
    configs,
    getDisabledConfigItems,
  };
};

export default useConfig;
