export type T_CreateUnitFields = {
  name: string;
  description: string;
  schoolId?: string;
  subjectId: string;
  gradeId: string;
  courseId: string;
  programId?: string;
};

export type T_FetchUnits = {
  limit?: number;
  skip?: number;
};

export type T_UnitFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  description: string;

  schoolId?: string;
  subjectId?: string;
  gradeId?: string;
  programId?: string;
  courseId?: string;

  subjectName?: string;
  gradeName?: string;
  schoolName?: string;
  programName?: string;
  courseName?: string;

  created_by?: string;
  created_at: string;

  user?: {
    _id: string;
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
  subject?: {
    name: string;
    _id: string;
  };
  grade?: {
    name: string;
    _id: string;
  };
};

/**
 * Corresponds to the type returned directly by the API with metadata
 */
export type T_RawUnitFields = {
  _id: string;
  name: string;
  description: string;

  created_at: string;
  updated_at: string;
  created_by_id?: string;

  school_id?: string;
  program_id?: string;
  subject_id?: string;
  grade_id?: string;
  course_id?: string;

  user?: {
    _id: string;
    email: string;
  };
  school?: {
    _id: string;
    name: string;
  };
  program?: {
    _id: string;
    name: string;
  };
  course?: {
    _id: string;
    name: string;
  };
  subject?: {
    _id: string;
    name: string;
  };
  grade?: {
    _id: string;
    name: string;
  };
};

export type T_UnitWithoutMetadata = {
  _id: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at: string;
  created_by_id?: string;
  school_id?: string;
  program_id?: string;
  course_id?: string;
  grade_id?: string;
  subject_id?: string;
};
