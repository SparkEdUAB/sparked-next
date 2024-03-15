export type T_CreateCourseFields = {
  name: string;
  description: string;
  schoolId: string;
};

export type T_FetchCourses = {
  limit?: number;
  skip?: number;
};

/**
 * Corresponds to the type returned directly by the API
 */
export type T_RawCourseFields = {
  key: string;
  name: string;
  _id: string;
  created_by: string;
  description: string;
  schoolId: string;
  programId: string;

  created_at: string;
  user: {
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
export type T_CourseFields = {
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
  schoolName: string | undefined;
  programName: string | undefined;
  programId: string | undefined;
  created_by: string;
  created_at: string;
};
