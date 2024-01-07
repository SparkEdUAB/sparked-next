"use client";

import AdminLayout from "@components/layouts/adminLayout";
import MediaContentListView from "@components/media-content/media-content-list-view";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <MediaContentListView />
    </AdminLayout>
  );
};

export default AdminSchools;
