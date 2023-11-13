export type TcreateUnitFields = {
  name: string;
  description: string;
  schoolId: string;
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
