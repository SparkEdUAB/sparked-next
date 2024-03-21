export type T_CreateSchoolFields = {
  name: string;
  description: string;
};
export type T_FetchSchools = {
  limit?: number;
  skip?: number;
};

export type T_SchoolTableFields = {
  key: string;
  name: string;
  _id: string;
};
