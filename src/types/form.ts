export interface I_formFields {
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
