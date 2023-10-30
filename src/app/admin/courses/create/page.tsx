"use client";

import CreateCourseView from "@components/courses/createCourseView";
import AdminLayout from "@components/layouts/adminLayout";
import React from "react";

const CreateProgram: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateCourseView />
    </AdminLayout>
  );
};

export default CreateProgram;
