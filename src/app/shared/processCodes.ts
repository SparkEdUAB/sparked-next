import { TProcessCode } from 'app/types';

//100 - 499
const SPARKED_PROCESS_CODES = {
  UNKNOWN_ERROR: 100,
  METHOD_NOT_FOUND: 101,
  DB_CONNECTION_FAILED: 102,
} satisfies TProcessCode;

export default SPARKED_PROCESS_CODES;
