import { TProcessCode } from 'types/navigation';

//6000 - 6999
const SUBJECT_PROCESS_CODES = {
  SUBJECT_EXIST: 6000,
  SUBJECT_NOT_FOUND: 6001,
  SUBJECT_EDITED: 6002,
  SUBJECT_CREATED: 6003,
  SUBJECT_DELETED: 6004,
} satisfies TProcessCode;

export default SUBJECT_PROCESS_CODES;
