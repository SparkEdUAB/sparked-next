export type T_CONFIG = {
  isAutoLoadCoreConfig?: Boolean;
};

export type T_CONFIG_VARIABLE = Record<string, T_CONFIG_STORE_STATE>;

export type T_CONFIG_VARIABLES = {
  schoolName: string;
  tagline: string;
  isUserAuth: Boolean;
  isHighSchool: Boolean;
  isConfigured: Boolean;
  serverUrl: string;
};

//this is used to determine how a config variable will be stored.
export enum T_CONFIG_STORE_STATE {
  COOKIE = 'COOKIE',
  STATE = 'STATE',
  STATE_STORE = 'STATE_STORE',
}
