export type T_CreateProgramFields = {
  name: string;
  description: string;
  schoolId: string;
};
export type T_FetchPrograms = {
  limit?: number;
  skip?: number;
};

export type T_ProgramFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  schoolName: string | undefined;
  schoolId: string | undefined;
  description: string;
  created_by: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
  school?: {
    name: string;
    _id: string;
  };
};

/**
 * Corresponds to the type returned directly by the API
 */
export type T_RawProgramFields = {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    _id: string;
    email: string;
  };
  school: {
    _id: string;
    name: string;
  };
};
