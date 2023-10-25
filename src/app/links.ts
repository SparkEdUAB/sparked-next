import { Tlink } from "./types";

export const API_LINKS: Tlink = {
  SIGNUP: "/api/authentication/signup",
  LOGIN: "/api/authentication/login",
  LOGOUT: "/api/authentication/logout",
  NEXT_AUTH_CREDENTIAL_LOGIN: "/api/auth/signin/credentials",
  // school links
  CREATE_SCHOOL: "/api/school/createSchool",
  FETCH_SCHOOLS: "/api/school/fetchSchools",
  FETCH_SCHOOL: "/api/school/fetchSchool",
  EDIT_SCHOOL: "/api/school/editSchool",
  DELETE_SCHOOLS: "/api/school/deleteSchools",
  FIND_SCHOOLS_BY_NAME: "/api/school/findSchoolsByName",
  // program links
  CREATE_PROGRAM: "/api/program/createProgram",
  FETCH_PROGRAMS: "/api/program/fetchPrograms",
  FETCH_PROGRAM: "/api/program/fetchProgram",
};
