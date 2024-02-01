import {  T_FORM } from "types/form";

export type T_MediaContentFields = {
  key?: string;
  name: string;
  _id: string;
  created_by?: string;
  description: string;
  schoolId: string;
  programId: string;
  courseId: string;
  unitId: string;
  topicId: string;
  file_url?: string;

  created_at?: string;
  user?: {
    name: string;
    email: string;
  };
  school?: {
    name: string;
    _id: string;
  };
  program?: {
    name: string;
    _id: string;
  };
  course?: {
    name: string;
    _id: string;
  };
  unit?: {
    name: string;
    _id: string;
  };
  topic?: {
    name: string;
    _id: string;
  };
};


export type T_MediaContentFormFields = {
  name: T_FORM;
  description: T_FORM;
  school: T_FORM;
  program: T_FORM;
  course: T_FORM;
  unit: T_FORM;
  topic: T_FORM;
};
