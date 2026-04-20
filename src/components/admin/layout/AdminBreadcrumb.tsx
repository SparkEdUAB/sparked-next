'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import useNavigation from '@hooks/useNavigation';
import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';
import React from 'react';

export function AdminBreadcrumb() {
  const { generateBreadcrumbItems, activeMenuItem } = useNavigation();
  const breadcrumbItems = generateBreadcrumbItems(
    ADMIN_LINKS,
    activeMenuItem?.link as string,
  );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.link}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === breadcrumbItems.length - 1 ? (
                <BreadcrumbPage className="flex items-center gap-1">
                  {index === 0 && <MdOutlineAdminPanelSettings className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.link} className="flex items-center gap-1">
                  {index === 0 && <MdOutlineAdminPanelSettings className="h-4 w-4" />}
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
