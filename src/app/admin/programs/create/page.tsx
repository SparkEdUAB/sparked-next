"use client";

import AdminLayout from "@components/layouts/adminLayout";
import CreateProgramView from "@components/programs/createProgramView";
import React from "react";

const CreateProgram: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateProgramView />
    </AdminLayout>
  );
};

export default CreateProgram;
