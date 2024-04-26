'use client';
import { message } from 'antd';
import { API_LINKS } from 'app/links';
import sharedConfig from 'app/shared/config';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { T_CONFIG, T_CONFIG_VARIABLES } from 'types/config';

const useConfig = (props: T_CONFIG) => {
  const { isAutoLoadCoreConfig } = props;

  const { getDisabledConfigItems } = sharedConfig();

  const [configs, setConfigs] = useState<T_CONFIG_VARIABLES | null>(null);

  useEffect(() => {
    isAutoLoadCoreConfig && loadConfigFile({});
  }, [isAutoLoadCoreConfig]);

  const loadConfigFile = async ({}) => {
    const url = API_LINKS.READ_CONFIG_FILE;

    try {
      const resp = await fetch(url);

      if (!resp.ok) {
        message.warning(i18next.t('unknown_error'));
        return false;
      }

      const responseData = await resp.json();

      if (responseData.isError) {
        message.warning(responseData.code);
        return false;
      }

      const _configs: T_CONFIG_VARIABLES = JSON.parse(responseData.configData);

      setConfigs(_configs);
    } catch (err: any) {
      // message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  return {
    loadConfigFile,
    configs,
    getDisabledConfigItems,
  };
};

export default useConfig;
