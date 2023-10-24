"use client";

import AdminLayout from "@components/layouts/adminLayout";
import EditSchoolView from "@components/school/editSchoolView";
import React from "react";

const CreateSchool: React.FC = (props) => {
  return (
    <AdminLayout>
      <EditSchoolView />
    </AdminLayout>
  );
};

export default CreateSchool;
