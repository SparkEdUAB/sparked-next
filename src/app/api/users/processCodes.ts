import { TProcessCode } from 'types/navigation';

//6500 - 6999
const USERS_PROCESS_CODES = {
  USER_EXIST: 6500,
  USER_NOT_FOUND: 6501,
  USER_EDITED: 6502,
  USER_CREATED: 6503,
  USER_DELETED: 6504,
} satisfies TProcessCode;

export default USERS_PROCESS_CODES;
