import { TProcessCode } from 'types/navigation';

//4000 - 4999
const PAGE_PROCESS_CODES = {
  PAGE_EXIST: 4000,
  PAGE_NOT_FOUND: 4001,
  PAGE_EDITED: 4002,
  PAGE_CREATED: 4003,
  PAGE_DELETED: 4004,
} satisfies TProcessCode;

export default PAGE_PROCESS_CODES;
