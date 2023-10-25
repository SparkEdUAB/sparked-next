export type TcreateProgramFields = {
  name: string;
  description: string;
  schoolId: string;
};
export type TfetchPrograms = {
  limit?: number;
  skip?: number;
};

export type TProgramFields = {
  key: string;
  name: string;
  _id: string;
  created_by: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
  school?: {
    name: string;
    _id: string;
  };
};
