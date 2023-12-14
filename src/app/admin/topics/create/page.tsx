"use client";

import AdminLayout from "@components/layouts/adminLayout";
import CreateTopicView from "@components/topic/create-topic-view";
import React from "react";

const CreateProgram: React.FC = (props) => {
  return (
    <AdminLayout>
      <CreateTopicView />
    </AdminLayout>
  );
};

export default CreateProgram;

