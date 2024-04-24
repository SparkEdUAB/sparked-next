'use client';
import { message } from 'antd';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { T_CONFIG, T_CONFIG_VARIABLES } from 'types/config';

const useConfig = (props: T_CONFIG) => {
  const { isAutoLoadCoreConfig } = props;

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

      const _configs: T_CONFIG_VARIABLES = JSON.parse(responseData.configFile);

      setConfigs(_configs);
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  const getDisabledConfigItems = ({ configs }: { configs: T_CONFIG_VARIABLES }) => {
    const disabledConfigItems: Array<string> = [];

    for (const key in configs) {
      //@ts-ignore
      const configVar = configs[key];
      const configVarkey = configVar.key;

      //check if this menu items is disabled in the config
      if (configVar.value === 'false') {
        disabledConfigItems.push(configVarkey);
      }
    }
    return disabledConfigItems;
  };

  return {
    loadConfigFile,
    configs,
    getDisabledConfigItems,
  };
};

export default useConfig;
