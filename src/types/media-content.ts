import { I_FORM } from 'types/form';

export type T_MediaContentFields = {
  index: number;
  key: string;
  _id: string;
  name: string;
  description: string;
  fileUrl?: string;
  thumbnailUrl?: string;

  schoolId?: string;
  programId?: string;
  courseId?: string;
  unitId?: string;
  topicId?: string;
  gradeId?: string;
  subjectId?: string;

  schoolName?: string;
  programName?: string;
  courseName?: string;
  unitName?: string;
  topicName?: string;
  gradeName?: string;
  subjectName?: string;

  created_by?: string;
  created_at?: string;
};

/**
 * Corresponds to the type returned directly by the API with metadata
 */
export type T_RawMediaContentFields = {
  _id: string;
  name: string;
  description: string;
  file_url: string | null;
  thumbnail_url?: string;
  likes: number;
  dislikes: number;
  viewCount: number;
  userReactions: {
    userId: string;
    type: 'like' | 'dislike';
    createdAt: Date;
  }[];

  created_at: string;
  updated_at: string;

  user?: {
    _id: string;
    email: string;
  };
  school?: {
    _id: string;
    name: string;
  };
  program?: {
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
  grade?: {
    name: string;
    _id: string;
  };
  subject?: {
    name: string;
    _id: string;
  };
};

export type T_MediaContentFormFields = {
  name: I_FORM;
  description: I_FORM;
  school: I_FORM;
  program: I_FORM;
  course: I_FORM;
  unit: I_FORM;
  topic: I_FORM;
  grade: I_FORM;
  subject: I_FORM;
};
