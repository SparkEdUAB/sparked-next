import { TProcessCode } from 'types/navigation';

//100 - 499
const SPARKED_PROCESS_CODES = {
  UNKNOWN_ERROR: 100,
  METHOD_NOT_FOUND: 101,
  DB_CONNECTION_FAILED: 102,
  UNAUTHORIZED: 4003,
} as const;

export default SPARKED_PROCESS_CODES;
