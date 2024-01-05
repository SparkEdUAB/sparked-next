export interface IformFields {
  [key: string]: {
    label: string;
    key: string;
    errorMsg?: string;
  };
}

export interface T_FORM {
  label: string;
  key: string;
  errorMsg?: string;
}
