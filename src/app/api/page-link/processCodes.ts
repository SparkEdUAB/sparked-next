import { TProcessCode } from 'types/navigation';

//7500 - 7999
const PAGE_LINK_PROCESS_CODES = {
  PAGE_EXIST: 7500,
  PAGE_NOT_FOUND: 7501,
  PAGE_EDITED: 7502,
  PAGE_CREATED: 7503,
  PAGE_DELETED: 7504,
  PAGE_ACTION_ALREADY_LINKED: 7505,
  PAGE_ACTION_LINKED: 7506,
  PAGE_ACTION_NOT_FOUND: 7507,
  PAGE_ACTION_UN_LINKED: 7508,
} satisfies TProcessCode;

export default PAGE_LINK_PROCESS_CODES;
