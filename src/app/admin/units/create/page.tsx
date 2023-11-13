"use client";

import AdminLayout from "@components/layouts/adminLayout";
import CreateUnitView from "@components/units/createUnitView";
import React from "react";

const CreateProgram: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateUnitView />
    </AdminLayout>
  );
};

export default CreateProgram;
