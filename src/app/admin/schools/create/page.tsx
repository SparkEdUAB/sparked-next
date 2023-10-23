"use client";

import AdminLayout from "@components/layouts/adminLayout";
import AdminHeader from "@components/layouts/adminLayout/AdminHeader";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import CreateSchoolView from "@components/school/createSchoolView";
import useNavigation from "@hooks/useNavigation";
import React from "react";

const CreateSchool: React.FC = (props) => {
  const { activeMenuItem } = useNavigation();

  return (
    <AdminLayout>
      <AdminHeader
        menuItems={ADMIN_LINKS}
        targetLink={activeMenuItem?.link as string}
      />
      <CreateSchoolView />
    </AdminLayout>
  );
};

export default CreateSchool;
