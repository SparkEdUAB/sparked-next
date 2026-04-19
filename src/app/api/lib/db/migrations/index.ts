import type { Migration } from '../migrate';
import { up as up001, name as name001 } from './001-add-default-roles';

export const migrations: Migration[] = [
  { name: name001, up: up001 },
];
