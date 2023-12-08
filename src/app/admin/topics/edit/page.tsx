"use client";

import AdminLayout from "@components/layouts/adminLayout";
import EditUnitView from "@components/units/edit-unit-view";
import React from "react";

const EditSchool: React.FC = (props) => {
  return (
    <AdminLayout>
      <EditUnitView />
    </AdminLayout>
  );
};

export default EditSchool;
