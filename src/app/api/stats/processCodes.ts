import { TProcessCode } from 'types/navigation';

//1400 - 1599
const UNIT_PROCESS_CODES = {
  UNIT_EXIST: 1400,
  COURSE_NOT_FOUND: 1401,
  UNIT_EDITED: 1402,
  UNIT_CREATED: 1403,
  SCHOOL_NOT_FOUND: 1404,
  PROGRAM_NOT_FOUND: 1405,
  UNIT_NOT_FOUND: 1406,
} satisfies TProcessCode;

export default UNIT_PROCESS_CODES;
