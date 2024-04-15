'use client';

import useNavigation from '@hooks/useNavigation';
import { Breadcrumb } from 'flowbite-react';
import { FC } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { T_MenuItemLink } from 'types/navigation/links';

const AdminHeader: FC<{ menuItems: T_MenuItemLink }> = ({ menuItems }) => {
  const { generateBreadcrumbItems, activeMenuItem } = useNavigation();

  const breadcrumbItems = generateBreadcrumbItems(menuItems, activeMenuItem?.link as string);

  return (
    <Breadcrumb aria-label="Admin breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <Breadcrumb.Item key={item.link} href={item.link} icon={index === 0 ? MdOutlineAdminPanelSettings : undefined}>
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default AdminHeader;
