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
  index: number;
  key: string;
  _id: string;
  name: string;
  schoolName: string | undefined;
  schoolId: string | undefined;
  description: string;
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

export type TRawProgramFields = {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: {
    _id: string;
    email: string;
  };
  school: {
    _id: string;
    name: string;
  };
};
