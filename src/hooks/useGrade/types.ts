export type T_CreateGradeFields = {
  name: string;
  description: string;
  schoolId?: string;
  programId?: string;
};

export type T_FetchGrades = {
  limit?: number;
  skip?: number;
};

/**
 * Corresponds to the type returned directly by the API
 */
export type T_RawGradeFields = {
  key: string;
  _id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
};

export type T_GradeFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  description: string;
  created_by?: string;
  created_at: string;
};
