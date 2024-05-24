import { TProcessCode } from 'types/navigation';

//5000 - 5999
const GRADE_PROCESS_CODES = {
  GRADE_EXIST: 5000,
  GRADE_NOT_FOUND: 5001,
  GRADE_EDITED: 5002,
  GRADE_CREATED: 5003,
  GRADE_DELETED: 5004,
} satisfies TProcessCode;

export default GRADE_PROCESS_CODES;
