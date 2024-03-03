'use client';

import useNavigation from '@hooks/useNavigation';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TmenuItemLinkParams } from 'types/links';
import { Sidebar } from 'flowbite-react';
import styled from 'styled-components';
import { toTitleCase } from 'utils/helpers';

// TODO: Refactor this to use antd
const FullHeightSidebar = styled(Sidebar)`
  height: 100vh;
`;
const AdminSidebar = () => {
  const { fetchAdminMenuItems } = useNavigation();
  const router = useRouter();
  const pathname = usePathname();

  const handleMenuClick = (link: string) => {
    router.push(`${link}`);
  };

  const renderMenuItems = (links: TmenuItemLinkParams[]) => {
    return links.map(({ key, label, icon, children, link }) => {
      const isActive = pathname === link;
      if (Number(children?.length) > 0) {
        const isChildActive = children?.some((child: any) => pathname === child.link);
        return (
          <Sidebar.Collapse label={toTitleCase(label)} key={key} active={isChildActive} icon={icon}>
            {children?.map((child: any) => (
              <Sidebar.Item
                key={child.key}
                active={pathname === child.link}
                onClick={() => handleMenuClick(child.link)}
              >
                {toTitleCase(child.label)}
              </Sidebar.Item>
            ))}
          </Sidebar.Collapse>
        );
      }
      return (
        <Sidebar.Item key={key} active={isActive} icon={icon} onClick={() => handleMenuClick(link)}>
          {toTitleCase(label)}
        </Sidebar.Item>
      );
    });
  };

  return (
    <FullHeightSidebar>
      <Sidebar aria-label="Sidebar with multi-level dropdown example">
        <Sidebar.Items>
          <Sidebar.ItemGroup>{renderMenuItems(fetchAdminMenuItems())}</Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </FullHeightSidebar>
  );
};

export default AdminSidebar;
