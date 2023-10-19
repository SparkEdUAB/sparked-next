"use client";

import AdminLayout from "@components/layouts/adminLayout";
import AdminHeader from "@components/layouts/adminLayout/AdminHeader";
import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import useNavigation from "@hooks/useNavigation";
import React from "react";

const CreateSchoolView: React.FC = (props) => {

  const {activeMenuItem} = useNavigation()

  return (
    <AdminLayout>
      <AdminHeader menuItems={ADMIN_LINKS} targetLink={activeMenuItem?.link as string}   />
    </AdminLayout>
  );
};

export default CreateSchoolView;
