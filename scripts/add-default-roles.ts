import { addDefaultRoles } from '../src/app/api/lib/db/migrations/addDefaultRoles';

// Run the migration
addDefaultRoles()
  .then(() => {
    console.log('Default roles migration completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error running default roles migration:', error);
    process.exit(1);
  });