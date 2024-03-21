import { T_SchoolFields } from '@components/school/types';

class schoolStore {
  selectedSchool: T_SchoolFields | null = null;

  constructor() {}

  setSelectedSchool = (selectedSchool: T_SchoolFields) => {
    this.selectedSchool = selectedSchool;
  };
}

const SchoolStore = new schoolStore();

export default SchoolStore;
