export type T_CreateTopicFields = {
  name: string;
  description: string;
  schoolId?: string;
  programId?: string;
  courseId?: string;
  subjectId?: string;
  gradeId?: string;
  unitId?: string;
};

export type T_FetchTopic = {
  limit?: number;
  skip?: number;
};

/**
 * Corresponds to the type returned directly by the API
 */
export type T_RawTopicFields = {
  key: string;
  name: string;
  _id: string;
  created_by: string;
  description: string;
  // school_id: string;
  // program_id: string;
  // course_id: string;
  unit_id: string;

  created_at: string;

  user?: {
    name: string;
    email: string;
  };
  // school?: {
  //   name: string;
  //   _id: string;
  // };
  // program?: {
  //   name: string;
  //   _id: string;
  // };
  // course?: {
  //   name: string;
  //   _id: string;
  // };
  unit?: {
    name: string;
    _id: string;
  };
  grade?: {
    name: string;
    _id: string;
  };
  subject?: {
    name: string;
    _id: string;
  };
};

export type T_TopicFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  description: string;

  school?: {
    name: string;
    _id: string;
  };

  unitId: string | undefined;
  subjectId: string | undefined;
  gradeId: string | undefined;
  // schoolId: string | undefined;
  // programId: string | undefined;
  // courseId: string | undefined;

  // schoolName: string | undefined;
  // programName: string | undefined;
  // courseName: string | undefined;
  unitName: string | undefined;
  subjectName: string | undefined;
  gradeName: string | undefined;

  created_by: string | undefined;
  created_at: string;
};

export type T_TopicSearchedByName = {
  _id: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at: string;
  created_by_id?: string;
  school_id?: string;
  program_id?: string;
  course_id?: string;
  unit_id?: string;
  grade_id?: string;
  subject_id?: string;
};
