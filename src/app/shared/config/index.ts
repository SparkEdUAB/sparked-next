import { T_STRING_ARRAY } from 'types';
import { T_CONFIG_VARIABLES } from 'types/config';

const sharedConfig = () => {
  const getDisabledConfigItems = ({ configs }: { configs: T_CONFIG_VARIABLES }) => {
    const disabledConfigItemKeys: T_STRING_ARRAY = [];

    for (const key in configs) {
      //@ts-ignore
      const configVar = configs[key];
      const configVarkey = configVar.key;

      //check if this menu items is disabled in the config
      if (configVar.value === 'false') {
        disabledConfigItemKeys.push(configVarkey);
      }
    }
    return disabledConfigItemKeys;
  };

  return {
    getDisabledConfigItems,
  };
};

export default sharedConfig;
