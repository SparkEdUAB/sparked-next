import { T_STRING_ARRAY } from 'types';
import { T_CONFIG_VARIABLES } from 'types/config';

const sharedConfig = () => {

const JWT_SECRET = process.env.JWT_SECRET;

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
  JWT_SECRET,
};
};

export default sharedConfig;
