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
 * Corresponds to the type returned directly by the API with metadata
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
    _id: string;
  };
};

export type T_SubjectFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  gradeId?: string;
  gradeName?: string;
  description: string;
  created_by?: string;
  created_at: string;
};

export type T_SubjectWithoutMetadata = {
  _id: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at: string;
  created_by_id?: string;
  grade_id?: string;
};
