export type TschoolTableView = {
  key: string;
  _id: string;
  name: string;
  created_by: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
};
