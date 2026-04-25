'use client';

import useNavigation from '@hooks/useNavigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { FC } from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import { T_MenuItemLink } from 'types/navigation/links';

const AdminHeader: FC<{ menuItems: T_MenuItemLink }> = ({ menuItems }) => {
  const { generateBreadcrumbItems, activeMenuItem } = useNavigation();

  const breadcrumbItems = generateBreadcrumbItems(menuItems, activeMenuItem?.link as string);

  return (
    <Breadcrumb aria-label="Admin breadcrumb">
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.link}>
            {index === 0 && (
              <MdOutlineAdminPanelSettings className="h-4 w-4 mr-1 inline-block" aria-hidden="true" />
            )}
            <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
            {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AdminHeader;
