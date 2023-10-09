import { TProcessCode } from "app/types";

//500 - 799
const AUTH_PROCESS_CODES: TProcessCode = {
  USER_EXIST: 500,
  UNKOWN_ERROR: 501,
  USER_NOT_FOUND: 502,
  USER_LOGGED_IN_OK: 503,
  INVALID_CREDENTIALS: 504,
};

export default AUTH_PROCESS_CODES;
