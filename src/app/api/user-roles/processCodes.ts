import { TProcessCode } from 'types/navigation';

//8000 - 8499
const USER_ROLES_PROCESS_CODES = {
  USER_ROLE_EXIST: 8000,
  USER_ROLE_NOT_FOUND: 8001,
  USER_ROLE_EDITED: 8002,
  USER_ROLE_CREATED: 8003,
  USER_ROLES_DELETED: 8004,
  USER_ROLES_ASSIGNED: 8005,
} satisfies TProcessCode;

export default USER_ROLES_PROCESS_CODES;
