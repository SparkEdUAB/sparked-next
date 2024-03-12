export type TcreateTopicFields = {
  name: string;
  description: string;
  schoolId?: string;
  programId?: string;
  courseId?: string;
  unitId?: string;
};
export type T_fetchTopic = {
  limit?: number;
  skip?: number;
};

/**
 * Corresponds to the type returned directly by the API
 */
export type TRawTopicFields = {
  key: string;
  name: string;
  _id: string;
  created_by: string;
  description: string;
  schoolId: string;
  programId: string;
  courseId: string;
  unitId: string;

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
  unit: {
    name: string;
    _id: string;
  };
};

export type T_topicFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  school?: {
    name: string;
    _id: string;
  };
  schoolId: string | undefined;
  unitId: string | undefined;
  description: string;
  schoolName: string | undefined;
  programId: string | undefined;
  programName: string | undefined;
  courseId: string | undefined;
  courseName: string | undefined;
  unitName: string;
  created_by: string | undefined;
  created_at: string;
};
