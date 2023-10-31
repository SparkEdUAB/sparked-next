export type TcreateCourseFields = {
  name: string;
  description: string;
  schoolId: string;
};
export type TfetchCourses = {
  limit?: number;
  skip?: number;
};

export type TcourseFields = {
  key: string;
  name: string;
  _id: string;
  created_by: string;
  description: string;
  schoolId: string;
  programId: string;

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
};
