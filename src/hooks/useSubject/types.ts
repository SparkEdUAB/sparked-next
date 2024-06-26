export type T_CreateSubjectFields = {
  name: string;
  description: string;
  gradeId: string;
};

export type T_FetchSubjects = {
  limit?: number;
  skip?: number;
};

/**
 * Corresponds to the type returned directly by the API
 */
export type T_RawSubjectFields = {
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
  grade?: {
    name: string;
    id: string;
  };
};

export type T_SubjectFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  gradeId: string;
  gradeName?: string;
  description: string;
  created_by?: string;
  created_at: string;
};
