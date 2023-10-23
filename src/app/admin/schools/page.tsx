"use client";

import AdminLayout from "@components/layouts/adminLayout";
import SchoolsListView from "@components/school/schoolsListView";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <SchoolsListView />
    </AdminLayout>
  );
};

export default AdminSchools;
