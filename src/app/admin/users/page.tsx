"use client";

import AdminLayout from "@components/layouts/adminLayout";
import UsersListView from "@components/users/UsersListView";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <UsersListView />
    </AdminLayout>
  );
};

export default AdminSchools;
