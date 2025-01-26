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
  // UNITS
  CREATE_UNIT: string;
  FETCH_UNITS: string;
  DELETE_UNITS: string;
  FETCH_UNIT_BY_ID: string;
  FETCH_UNITS_BY_SUBJECT_ID: string;
  FETCH_UNITS_BY_TOPIC_ID: string;
  FETCH_UNITS_BY_GRADE_ID: string;
  EDIT_UNIT: string;
  FIND_UNITS_BY_NAME: string;

  // TOPICS
  CREATE_TOPIC: string;
  FETCH_TOPICS: string;
  DELETE_TOPICS: string;
  FETCH_TOPIC_BY_ID: string;
  FETCH_TOPICS_BY_UNIT_ID: string;
  FETCH_TOPICS_BY_GRADE_ID: string;
  FETCH_TOPICS_BY_SUBJECT_ID: string;
  FIND_TOPIC_BY_NAME: string;
  EDIT_TOPIC: string;
  CREATE_MEDIA_CONTENT: string;
  DELETE_RESOURCES: string;

  // MEDIA
  FIND_MEDIA_CONTENT_BY_NAME: string;
  FILE_UPLOAD: string;
  FETCH_MEDIA_CONTENT: string;
  FETCH_RELATED_MEDIA_CONTENT: string;
  FETCH_MEDIA_CONTENT_BY_ID: string;
  EDIT_MEDIA_CONTENT: string;
  DELETE_MEDIA_CONTENT: string;
  FETCH_RANDOM_MEDIA_CONTENT: string;
  FETCH_MEDIA_TYPES: string;

  // PAGE LINKS
  CREATE_PAGE_LINK: string;
  CREATE_USER: string;
  EDIT_PAGE_LINK: string;
  DELETE_PAGE_LINK: string;
  FETCH_PAGE_LINKS: string;
  ASSIGN_PAGE_ACTION_TO_PAGE_LINK: string;
  UNASSIGN_PAGE_ACTION_TO_PAGE_LINK: string;

  //   SETTINGS > PAGE ACTIONS
  CREATE_PAGE_ACTION: string;
  EDIT_PAGE_ACTION: string;
  DELETE_PAGE_ACTION: string;
  FETCH_PAGE_ACTION: string;

  // SETTINGS > USER ROLES
  CREATE_USER_ROLE: string;
  EDIT_USER_ROLE: string;
  ASSIGN_USER_ROLE: string;
  DELETE_USER_ROLES: string;
  FETCH_USER_ROLES: string;
  FETCH_USER_ROLE_BY_ID: string;

  // GRADE
  CREATE_GRADE: string;
  FETCH_GRADES: string;
  DELETE_GRADES: string;
  FETCH_GRADE_BY_ID: string;
  EDIT_GRADE: string;
  FIND_GRADE_BY_NAME: string;

  // SUBJECT
  CREATE_SUBJECT: string;
  FETCH_SUBJECTS: string;
  DELETE_SUBJECTS: string;
  FETCH_SUBJECT_BY_ID: string;
  FETCH_SUBJECTS_BY_GRADE_ID: string;
  EDIT_SUBJECT: string;
  FIND_SUBJECT_BY_NAME: string;

  // CATEGORY
  CREATE_CATEGORY: string;
  FETCH_CATEGORIES: string;
  DELETE_CATEGORIES: string;
  FETCH_CATEGORY_BY_ID: string;
  EDIT_CATEGORY: string;
  FIND_CATEGORY_BY_NAME: string;
  FETCH_ALL_STATS: string;
  //config
  READ_CONFIG_FILE: string;

  // users
  FETCH_USERS: string;
  FIND_USERS_BY_NAME: string;
  FIND_USERS_BY_ID: string;
  EDIT_USER: string;
  DELETE_USERS: string;
};

export type TProcessCode = {
  [key: string]: number;
};

export type T_Record = Record<string, string>;
export type T_React_key = React.Key;
