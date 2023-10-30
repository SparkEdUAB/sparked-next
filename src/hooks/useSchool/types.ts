export type TcreateSchoolFields = {
  name: string;
  description: string;
};
export type TfetchSchools = {
  limit?: number;
  skip?: number;
};

export type TschoolTableFields = {
  key: string;
  name: string;
  _id: string;
};
