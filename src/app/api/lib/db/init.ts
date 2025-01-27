import { addDefaultRoles } from './migrations/addDefaultRoles';

export async function initializeDatabase() {
  await addDefaultRoles();
}
