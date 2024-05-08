export type T_CreateUnitFields = {
  name: string;
  description: string;
  schoolId?: string;
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
  programId?: string;
  courseId?: string;

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
};

/**
 * Corresponds to the type returned directly by the API
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
};
