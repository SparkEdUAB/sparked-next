export type T_SignupFields = {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  isStudent: boolean;
  institutionType?: string;
  schoolName?: string;
  grade?: number | string;
  institutionId?: string;
  institutionName?: string;
};

export type T_LoginFields = {
  email: string;
  password: string;
};
