export type T_CreateCategoryFields = {
  name: string;
  description: string;
  schoolId?: string;
  programId?: string;
};

export type T_FetchCategorys = {
  limit?: number;
  skip?: number;
};

/**
 * Corresponds to the type returned directly by the API
 */
export type T_RawCategoryFields = {
  key: string;
  _id: string;
  name: string;
  description: string;

  created_by: string;
  created_at: string;

  schoolId: string;
  programId: string;

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
};

export type T_CategoryFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  description: string;

  school:
    | {
        name: string;
        _id: string;
      }
    | undefined;

  schoolId: string | undefined;
  programId: string | undefined;

  schoolName: string | undefined;
  programName: string | undefined;

  created_by?: string;
  created_at: string;
};
