"use client";

import CourseListView from "@components/courses/courseListView";
import AdminLayout from "@components/layouts/adminLayout";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <CourseListView />
    </AdminLayout>
  );
};

export default AdminSchools;
