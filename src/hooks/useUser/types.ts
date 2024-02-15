export type T_createUserFields = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  gender: string;
};
export type TfetchUnits = {
  limit?: number;
  skip?: number;
};

export type TUnitFields = {
  key: string;
  name: string;
  _id: string;
  created_by: string;
  description: string;
  schoolId: string;
  programId: string;
  courseId: string;

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
};
