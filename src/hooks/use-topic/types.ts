export type TcreateTopicFields = {
  name: string;
  description: string;
  schoolId?: string;
  programId?: string;
  courseId?: string;
  unitId: string;
};
export type T_fetchTopic = {
  limit?: number;
  skip?: number;
};

export type T_topicFields = {
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
