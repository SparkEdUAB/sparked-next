export interface I_FormFields {
  [key: string]: {
    label: string;
    key: string;
    errorMsg?: string;
  };
}

export interface I_FORM {
  label: string;
  key: string;
  errorMsg?: string;
}
