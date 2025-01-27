export type T_CreateUserFields = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: string;
  role: string;
};
export type T_FetchUsers = {
  limit?: number;
  skip?: number;
};

export type T_UserFields = {
  index: number;
  key: string;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  _id?: string;

  schoolId?: string;
  programId?: string;

  schoolName?: string;
  programName?: string;
  courseName?: string;

  created_by?: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
  school?: {
    name: string;
    _id: string;
  };
  program?: {
    name: string;
    _id: string;
  };
  course?: {
    name: string;
    _id: string;
  };
};

export type T_RawUserFields = {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  is_verified: boolean;
  created_at: string;
};

export type T_SignupFields = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
