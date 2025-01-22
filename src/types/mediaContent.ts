export type T_MediaContentFields = {
  _id: string;
  title: string;
  description: string;
  file_url: string;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
  grade?: {
    _id: string;
    name: string;
  };
  subject?: {
    _id: string;
    name: string;
  };
  course?: {
    _id: string;
    name: string;
  };
  unit?: {
    _id: string;
    name: string;
  };
  topic?: {
    _id: string;
    name: string;
  };
};
