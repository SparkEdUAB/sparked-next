import { TProcessCode } from 'app/types';

// 2600 - 3099
const MEDIA_PROCESS_CODES = {
  MEDIA_UPLOADED_OK: 2600,
  MEDIA_UPLOAD_FAILED: 2601,
} satisfies TProcessCode;

export default MEDIA_PROCESS_CODES;
