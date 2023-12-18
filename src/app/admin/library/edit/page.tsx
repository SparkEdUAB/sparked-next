"use client";

import AdminLayout from "@components/layouts/adminLayout";
import EditTopicView from "@components/topic/edit-topic-view";
import React from "react";

const EditSchool: React.FC = (props) => {
  return (
    <AdminLayout>
      <EditTopicView />
    </AdminLayout>
  );
};

export default EditSchool;
