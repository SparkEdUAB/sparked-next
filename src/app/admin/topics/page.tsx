"use client";

import AdminLayout from "@components/layouts/adminLayout";
import TopicsListView from "@components/topic/topics-list-view";
import React from "react";

const AdminSchools: React.FC = (props) => {
  return (
    <AdminLayout>
      <TopicsListView />
    </AdminLayout>
  );
};

export default AdminSchools;
