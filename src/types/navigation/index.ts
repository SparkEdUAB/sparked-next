import React from 'react';

export type T_link = {
  SIGNUP: string;
  LOGIN: string;
  LOGOUT: string;
  NEXT_AUTH_CREDENTIAL_LOGIN: string;
  FETCH_SCHOOLS: string;
  CREATE_SCHOOL: string;
  FETCH_SCHOOL: string;
  EDIT_SCHOOL: string;
  DELETE_SCHOOLS: string;
  FIND_SCHOOLS_BY_NAME: string;
  CREATE_PROGRAM: string;
  FETCH_PROGRAMS: string;
  FETCH_PROGRAM_BY_ID: string;
  EDIT_PROGRAM: string;
  DELETE_PROGRAMS: string;
  FIND_PROGRAMS_BY_NAME: string;
  CREATE_COURSE: string;
  FETCH_COURSES: string;
  FETCH_COURSE_BY_ID: string;
  EDIT_COURSE: string;
  DELETE_COURSES: string;
  FIND_COURSE_BY_NAME: string;
  CREATE_UNIT: string;
  FETCH_UNITS: string;
  DELETE_UNITS: string;
  FETCH_UNIT_BY_ID: string;
  EDIT_UNIT: string;
  FIND_UNITS_BY_NAME: string;
  CREATE_TOPIC: string;
  FETCH_TOPICS: string;
  DELETE_TOPICS: string;
  FETCH_TOPIC_BY_ID: string;
  FIND_TOPIC_BY_NAME: string;
  EDIT_TOPIC: string;
  CREATE_MEDIA_CONTENT: string;
  DELETE_RESOURCES: string;
  FIND_MEDIA_CONTENT_BY_NAME: string;
  FILE_UPLOAD: string;
  FETCH_MEDIA_CONTENT: string;
  FETCH_RELATED_MEDIA_CONTENT: string;
  FETCH_MEDIA_CONTENT_BY_ID: string;
  EDIT_MEDIA_CONTENT: string;
  DELETE_MEDIA_CONTENT: string;
  FETCH_RANDOM_MEDIA_CONTENT: string;
  CREATE_PAGE_LINK: string;
  CREATE_USER: string;
  EDIT_PAGE_LINK: string;
  DELETE_PAGE_LINK: string;

  // GRADE
  CREATE_GRADE: string;
  FETCH_GRADES: string;
  DELETE_GRADES: string;
  FETCH_GRADE_BY_ID: string;
  EDIT_GRADE: string;
  FIND_GRADE_BY_NAME: string;

  //config
  READ_CONFIG_FILE: string;
};

export type TProcessCode = {
  [key: string]: number;
};

export type T_Record = Record<string, string>;
export type T_React_key = React.Key;
