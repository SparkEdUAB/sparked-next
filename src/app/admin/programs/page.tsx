"use client";

import AdminLayout from "@components/layouts/adminLayout";
import ProgramsListView from "@components/programs/programListView";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <ProgramsListView />
    </AdminLayout>
  );
};

export default AdminSchools;
