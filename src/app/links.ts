import { Tlink } from "./types";

export const API_LINKS: Tlink = {
  SIGNUP: "/api/authentication/signup",
  LOGIN: "/api/authentication/login",
  LOGOUT: "/api/authentication/logout",
  NEXT_AUTH_CREDENTIAL_LOGIN: "/api/auth/signin/credentials",
  CREATE_SCHOOL: "/api/school/createSchool",
  FETCH_SCHOOLS: "/api/school/fetchSchools",
  FETCH_SCHOOL: "/api/school/fetchSchool",
  EDIT_SCHOOL: "/api/school/editSchool",
  DELETE_SCHOOLS: "/api/school/deleteSchools",
};
