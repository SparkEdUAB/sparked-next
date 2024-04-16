import { TProcessCode } from 'app/types';

//800 - 999
const SCHOOL_PROCESS_CODES = {
  SCHOOL_EXIST: 800,
  SCHOOL_NOT_FOUND: 801,
  SCHOOL_EDITED: 802,
  SCHOOL_CREATED: 803,
} satisfies TProcessCode;

export default SCHOOL_PROCESS_CODES;
