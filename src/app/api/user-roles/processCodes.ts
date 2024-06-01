import { TProcessCode } from 'types/navigation';

//5000 - 5999
const USER_ROLES_PROCESS_CODES = {
  USER_ROLE_EXIST: 5000,
  USER_ROLE_NOT_FOUND: 5001,
  USER_ROLE_EDITED: 5002,
  USER_ROLE_CREATED: 5003,
  USER_ROLE_DELETED: 5004,
} satisfies TProcessCode;

export default USER_ROLES_PROCESS_CODES;
