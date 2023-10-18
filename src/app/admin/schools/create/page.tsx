"use client";

import Login from "@components/auth/login";
import AdminLayout from "@components/layouts/adminLayout";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <Login />
    </AdminLayout>
  );
};

export default AdminSchools;
