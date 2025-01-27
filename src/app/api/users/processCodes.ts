import { TProcessCode } from 'types/navigation';

//6500 - 6999
const USER_PROCESS_CODES = {
  USER_EXIST: 6500,
  USER_NOT_FOUND: 6501,
  USER_EDITED: 6502,
  USER_CREATED: 6503,
  USER_DELETED: 6504,
  INVALID_ROLE: 7005,
} satisfies TProcessCode;

export default USER_PROCESS_CODES;
