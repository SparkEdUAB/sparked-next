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
  FETCH_PROGRAM_BY_ID: "/api/program/fetchProgramById",
  EDIT_PROGRAM: "/api/program/editProgram",
  DELETE_PROGRAMS: "/api/program/deletePrograms",
  FIND_PROGRAMS_BY_NAME: "/api/program/findProgramsByName",
};
