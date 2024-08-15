export type T_PageLinkFields = {
  _id: string;
  key: string;
  index: number;
  name: string;
  description: string;
  link: string;
  page_action_ids: Array<string>;
};

export type T_RawPageLinkFields = {
  _id: string;
  name: string;
  description: string;
  link: string;
  page_action_ids: Array<string>;
  created_at: string;
  updated_at: string;
  created_by_id: string;
  updated_by: string;
};

export type T_CreatePageLinkFields = {
  name: string;
  description: string;
  pageLink: string;
};
