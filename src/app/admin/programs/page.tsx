"use client";

import AdminLayout from "@components/layouts/adminLayout";
import ProgramsListView from "@components/programs/schoolsListView";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <ProgramsListView />
    </AdminLayout>
  );
};

export default AdminSchools;
