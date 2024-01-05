"use client";

import AdminLayout from "@components/layouts/adminLayout";
import CreateResourceView from "@components/library/create-resource-view";
import React from "react";

const CreateProgram: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateResourceView />
    </AdminLayout>
  );
};

export default CreateProgram;

