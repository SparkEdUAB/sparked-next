"use client";

import AdminLayout from "@components/layouts/adminLayout";
import EditMediaContentView from "@components/media-content/edit-media-content-view";
import React from "react";

const EditSchool: React.FC = (props) => {
  return (
    <AdminLayout>
      <EditMediaContentView />
    </AdminLayout>
  );
};

export default EditSchool;
