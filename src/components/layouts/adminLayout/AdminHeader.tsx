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
      items={[
        ...breadcrumbItems.map((i) => (activeMenuItem?.label !== i.label ?{
          title: <a href={i.link}>{i.label}</a>,
        }:{})),
        {
          title: activeMenuItem?.label,
        },
      ]}
    />
  );
};

export default AdminHeader;
