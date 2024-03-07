"use client";

import useNavigation from "@hooks/useNavigation";
import { Breadcrumb } from "antd";
import { FC } from "react";
import { TmenuItemLink } from "types/links";

const AdminHeader: FC<{ menuItems: TmenuItemLink; targetLink: string }> = ({
  menuItems,
  targetLink,
}) => {
  const { generateBreadcrumbItems, activeMenuItem } = useNavigation();

  const breadcrumbItems = generateBreadcrumbItems(menuItems, targetLink);

  return (
    <Breadcrumb
    className="admin-breadcrumbs"
      items={[
        ...breadcrumbItems.map((i) => (activeMenuItem?.label !== i.label ?{
          title: <a className="admin-breadcrumb-item" href={i.link}>{i.label}</a>,
        }:{})),
        {
          title: <a className="admin-active-breadcrumb-item" >{activeMenuItem?.label}</a>,
        },
      ]}
    />
  );
};

export default AdminHeader;
