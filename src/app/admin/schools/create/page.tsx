"use client";

import AdminLayout from "@components/layouts/adminLayout";
import CreateSchoolView from "@components/school/createSchoolView";
import React from "react";

const CreateSchool: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateSchoolView />
    </AdminLayout>
  );
};

export default CreateSchool;
