"use client";

import AdminLayout from "@components/layouts/adminLayout";
import EditProgramView from "@components/programs/editProgramView";
import React from "react";

const CreateSchool: React.FC = (props) => {
  return (
    <AdminLayout>
      <EditProgramView />
    </AdminLayout>
  );
};

export default CreateSchool;
