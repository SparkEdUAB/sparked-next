import { TProcessCode } from 'types/navigation';

// 4000 - 4999 @last
const CONFIG_PROCESS_CODES = {
  READING_FILE_FAILED: 4000,
  FILE_READ: 4001,
} satisfies TProcessCode;

export default CONFIG_PROCESS_CODES;
