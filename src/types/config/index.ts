export type T_CONFIG = {
  isAutoLoadCoreConfig?: Boolean;
};

export type T_CONFIG_DB_VARIABLE = {
  key?: string;
  value?: number;
  fieldName: string;
};

export type T_CONFIG_VARIABLE = {
  key: string;
  value: string | number | Boolean;
  label: string;
  stateLocation: T_CONFIG_STORE_STATE;
};

export type T_CONFIG_VARIABLES = {
  schoolName: T_CONFIG_VARIABLE;
  tagline: T_CONFIG_VARIABLE;
  isUserAuth: T_CONFIG_VARIABLE;
  isHighSchool: T_CONFIG_VARIABLE;
  isConfigured: T_CONFIG_VARIABLE;
  serverUrl: T_CONFIG_VARIABLE;
  showSchool: T_CONFIG_VARIABLE;
  showPrograms: T_CONFIG_VARIABLE;
};

//this is used to determine how a config variable will be stored.
export enum T_CONFIG_STORE_STATE {
  COOKIE = 'COOKIE',
  STATE = 'STATE',
  STATE_STORE = 'STATE_STORE',
}
