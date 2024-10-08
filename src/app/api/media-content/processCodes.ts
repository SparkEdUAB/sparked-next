import { TProcessCode } from 'types/navigation';

// 2100 - 2599
const MEDIA_CONTENT_PROCESS_CODES = {
  RESOURCE_EXIST: 2100,
  COURSE_NOT_FOUND: 2101,
  RESOURCE_EDITED: 2102,
  RESOURCE_CREATED: 2103,
  SCHOOL_NOT_FOUND: 2104,
  PROGRAM_NOT_FOUND: 2105,
  RESOURCE_NOT_FOUND: 2106,
  UNIT_NOT_FOUND: 2107,
  TOPIC_NOT_FOUND: 2108,
  MEDIA_CONTENT_NOT_FOUND: 2109,
  MEDIA_CONTENT_EDITED: 2110,
  GRADE_NOT_FOUND: 2111,
  SUBJECT_NOT_FOUND: 2112,
} satisfies TProcessCode;

export default MEDIA_CONTENT_PROCESS_CODES;
