'use client';
import { message } from 'antd';
import { API_LINKS } from 'app/links';
import i18next from 'i18next';
import { useEffect, useState } from 'react';
import { T_CONFIG, T_CONFIG_VARIABLES } from 'types/config';

const useConfig = (props: T_CONFIG) => {
  const { isAutoLoadCoreConfig } = props;

  const [schoolName, setSchoolName] = useState<string>('');

  useEffect(() => {
    isAutoLoadCoreConfig && loadConfigFile({});
  }, [isAutoLoadCoreConfig]);

  const loadConfigFile = async ({}) => {
    const url = API_LINKS.READ_CONFIG_FILE;
    const formData = {
      body: JSON.stringify({}),
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
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

      const { schoolName }: T_CONFIG_VARIABLES = JSON.parse(responseData.configFile);

      setSchoolName(schoolName);
    } catch (err: any) {
      message.error(`${i18next.t('unknown_error')}. ${err.msg ? err.msg : ''}`);
      return false;
    }
  };

  return {
    loadConfigFile,
    schoolName,
  };
};

export default useConfig;
