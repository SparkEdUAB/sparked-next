"use client";

import EditCourseView from "@components/courses/editCourseView";
import AdminLayout from "@components/layouts/adminLayout";
import React from "react";

const EditSchool: React.FC = (props) => {
  return (
    <AdminLayout>
      <EditCourseView />
    </AdminLayout>
  );
};

export default EditSchool;
