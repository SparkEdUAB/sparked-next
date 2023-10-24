export type TcreateProgramFields = {
  name: string;
  description: string;
  schoolId: string;
};
export type TfetchPrograms = {
  limit?: number;
  skip?: number;
};

export type TProgramTableFields = {
  key: string;
  name: string;
  _id: string;
};
