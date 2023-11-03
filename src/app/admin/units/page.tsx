"use client";

import AdminLayout from "@components/layouts/adminLayout";
import UnitListView from "@components/units/unitListView";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <UnitListView />
    </AdminLayout>
  );
};

export default AdminSchools;
