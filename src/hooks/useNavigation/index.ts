import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useConfig from '@hooks/use-config';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { useParams, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { T_BreadcrumbItems, T_MenuItemLink, T_MenuItemLinkParams } from 'types/navigation/links';

const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { configs, getDisabledConfigItems } = useConfig();

  const fetchAdminMenuItems = useCallback(() => {
    const menuItems: Array<T_MenuItemLinkParams> = [];

    const filteredMenuItems: Array<string> = configs ? getDisabledConfigItems({ configs }) : [];

    for (const menuItem in ADMIN_LINKS) {
      const entry = ADMIN_LINKS[menuItem as keyof T_MenuItemLink];
      menuItems.push(entry as T_MenuItemLinkParams);
    }

    return menuItems.filter((i) => filteredMenuItems.indexOf(i.key.replace('admin_', '')) === -1);
  }, [configs, getDisabledConfigItems]);

  const getActiveMenuItem = useMemo(() => {
    const menuItems = fetchAdminMenuItems();
    return menuItems.find((i) => i.link === pathname) || null;
  }, [pathname, fetchAdminMenuItems]);

  const isActiveMenuItem = useCallback(
    (menuItem: T_MenuItemLinkParams): boolean => {
      return pathname === menuItem.link;
    },
    [pathname],
  );

  const generateBreadcrumbItems = useCallback((menuItems: T_MenuItemLink, targetLink: string) => {
    const breadcrumbItems: T_BreadcrumbItems = [];

    if (!targetLink) return breadcrumbItems;
    const linkSegments = targetLink.split('/');

    linkSegments.map((_, index) => {
      for (const menuItem in menuItems) {
        const targetLinkSegment = linkSegments.slice(0, index + 1).join('/');

        if (menuItems[menuItem as keyof T_MenuItemLink]?.link === targetLinkSegment) {
          breadcrumbItems.push({
            link: targetLinkSegment,
            label: menuItems[menuItem as keyof T_MenuItemLink]?.label || '',
          });

          for (let child of menuItems[menuItem as keyof T_MenuItemLink]?.children || []) {
            const targetLinkSegment = linkSegments.slice(0, index + 2).join('/');

            if (child.link === targetLinkSegment) {
              breadcrumbItems.push({
                link: targetLinkSegment,
                label: child.label,
              });
            }
          }
        }
      }
    });

    return breadcrumbItems;
  }, []);

  const getChildLinkByKey = useCallback((key: string, parentLink: T_MenuItemLinkParams) => {
    const links = parentLink.children?.filter((i) => i.key === key);

    if (links?.length) {
      return links[0].link;
    } else {
      return '';
    }
  }, []);

  const apiNavigator = axios;

  return {
    fetchAdminMenuItems,
    isActiveMenuItem,
    pathname,
    activeMenuItem: getActiveMenuItem,
    generateBreadcrumbItems,
    router,
    getChildLinkByKey,
    useParams,
    apiNavigator,
  };
};

export default useNavigation;
