import { TschoolFields } from "@components/school/types";

class schoolStore {
  selectedSchool: TschoolFields | null = null;

  constructor() {}

  setSelectedSchool = (selectedSchool: TschoolFields) => {
    this.selectedSchool = selectedSchool;
  };
}

const SchoolStore = new schoolStore();

export default SchoolStore;
