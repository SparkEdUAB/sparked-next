import { Db } from 'mongodb';
import { addDefaultRoles } from './migrations/addDefaultRoles';
import { addDefaultOrganizationAndTenantData } from './migrations/addDefaultOrganizationAndTenantData';

export async function initializeDatabase(db: Db) {
  await addDefaultRoles(db);
  await addDefaultOrganizationAndTenantData(db);
}
