import { T_FORM } from 'types/form';

export type T_MediaContentFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  description: string;
  fileUrl?: string;

  schoolId?: string;
  programId?: string;
  courseId?: string;
  unitId?: string;
  topicId?: string;

  schoolName: string;
  programName: string;
  courseName: string;
  unitName: string;
  topicName: string;

  created_by?: string;
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

export type TRawMediaContentFields = {
  _id: string;
  name: string;
  description: string;
  file_url: string;

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
  program: {
    _id: string;
    name: string;
  };
  course: {
    _id: string;
    name: string;
  };
  unit: {
    _id: string;
    name: string;
  };
  topic: {
    _id: string;
    name: string;
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
