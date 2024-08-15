export type T_RoleFields = {
  _id: string;
  key: string;
  index: number;
  name: string;
  description: string;
};

export type T_RawRoleFields = {
  _id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  updated_by_id: string;
};

export type T_CreateRoleFields = {
  name: string;
  description: string;
};
