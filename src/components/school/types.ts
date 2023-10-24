export type TschoolFields = {
  key: string;
  _id: string;
  name: string;
  description: string;
  created_by: string;
  created_at: string;
  user: {
    name: string;
    email: string;
  };
};
