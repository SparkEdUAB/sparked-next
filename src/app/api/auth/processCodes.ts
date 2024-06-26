import { TProcessCode } from 'types/navigation';

//500 - 799
const AUTH_PROCESS_CODES = {
  USER_EXIST: 500,
  UNKNOWN_ERROR: 501,
  USER_NOT_FOUND: 502,
  USER_LOGGED_IN_OK: 503,
  INVALID_CREDENTIALS: 504,
  USER_LOGGED_OUT_OK: 505,
  FAILED_TO_LOGOUT_USER: 505,
  USER_ALREADY_EXIST: 506,
  USER_CREATED: 507,
} satisfies TProcessCode;

export default AUTH_PROCESS_CODES;
