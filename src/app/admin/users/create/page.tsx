"use client";

import AdminLayout from "@components/layouts/adminLayout";
import CreateUserView from "@components/users/create-user-view";
import React from "react";

const CreateProgram: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateUserView />
    </AdminLayout>
  );
};

export default CreateProgram;
