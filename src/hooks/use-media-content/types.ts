export type T_CreateResourceFields = {
  name: string;
  description: string;
  schoolId?: string;
  programId?: string;
  courseId?: string;
  unitId?: string;
  topicId?: string;
  gradeId?: string;
  subjectId?: string;
  fileUrl?: string | null;
  externalUrl?: string | null;
};
export type T_FetchTopic = {
  limit?: number;
  skip?: number;
};

export type T_RawMediaTypeFieldes = {
  _id: string;
  name: string;
};
