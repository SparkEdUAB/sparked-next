import type { Migration } from '../migrate';
import { up as up001, name as name001 } from './001-add-default-roles';
import { up as up002, name as name002 } from './002-add-indexes';
import { up as up003, name as name003 } from './003-fix-schema-typos';
import { up as up004, name as name004 } from './004-add-institution-id-fields';
import { up as up005, name as name005 } from './005-add-institution-collections';
import { up as up006, name as name006 } from './006-backfill-user-role-mappings';

export const migrations: Migration[] = [
  { name: name001, up: up001 },
  { name: name002, up: up002 },
  { name: name003, up: up003 },
  { name: name004, up: up004 },
  { name: name005, up: up005 },
  { name: name006, up: up006 },
];
