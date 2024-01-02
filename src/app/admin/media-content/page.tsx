"use client";

import AdminLayout from "@components/layouts/adminLayout";
import ResourceListView from "@components/library/resource-list-view";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <ResourceListView />
    </AdminLayout>
  );
};

export default AdminSchools;
