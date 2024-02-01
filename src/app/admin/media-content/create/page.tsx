"use client";

import AdminLayout from "@components/layouts/adminLayout";
import CreateMediaContentView from "@components/media-content/create-media-content-view";
import React from "react";

const CreateProgram: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateMediaContentView />
    </AdminLayout>
  );
};

export default CreateProgram;

