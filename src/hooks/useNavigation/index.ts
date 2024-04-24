import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import useConfig from '@hooks/use-config';
import NavigationStore from '@state/mobx/navigationStore';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { useParams, usePathname } from 'next/navigation';
import { T_BreadcrumbItems, T_MenuItemLink, T_MenuItemLinkParams } from 'types/navigation/links';

const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { configs, getDisabledConfigItems } = useConfig({ isAutoLoadCoreConfig: true });

  const { activeMenuItem } = NavigationStore;

  const fetchAdminMenuItems = () => {
    const menuItems: Array<T_MenuItemLinkParams> = [];

    const filteredMenuItems: Array<string> = configs ? getDisabledConfigItems({ configs }) : [];

    for (const menuItem in ADMIN_LINKS) {
      const entry = ADMIN_LINKS[menuItem as keyof T_MenuItemLink];
      menuItems.push(entry);
    }

    return menuItems.filter((i) => filteredMenuItems.indexOf(i.key.replace('admin_', '')) === -1);
  };

  const isActiveMenuItem = (menuItem: T_MenuItemLinkParams): boolean => {
    if (pathname === menuItem.link) {
      NavigationStore.setActiveMenuItem(menuItem);
      return true;
    }

    const childActiveMenus = menuItem.children?.filter((i) => i.link === pathname);

    childActiveMenus?.length && NavigationStore.setActiveMenuItem(childActiveMenus[0]);

    return menuItem.children && childActiveMenus?.length !== 0 ? true : false;
  };

  const generateBreadcrumbItems = (menuItems: T_MenuItemLink, targetLink: string) => {
    const breadcrumbItems: T_BreadcrumbItems = [];

    if (!targetLink) return breadcrumbItems;
    const linkSegments = targetLink.split('/');

    linkSegments.map((_, index) => {
      for (const menuItem in menuItems) {
        const targetLinkSegment = linkSegments.slice(0, index + 1).join('/');

        //@ts-ignore
        if (menuItems[menuItem].link === targetLinkSegment) {
          breadcrumbItems.push({
            link: targetLinkSegment,
            //@ts-ignore
            label: menuItems[menuItem].label,
          });
        }
      }
    });

    return breadcrumbItems;
  };

  const getChildLinkByKey = (key: string, parentLink: T_MenuItemLinkParams) => {
    const links = parentLink.children?.filter((i) => i.key === key);

    if (links?.length) {
      return links[0].link;
    } else {
      return '';
    }
  };

  const apiNavigator = axios;

  return {
    fetchAdminMenuItems,
    isActiveMenuItem,
    pathname,
    activeMenuItem,
    generateBreadcrumbItems,
    router,
    getChildLinkByKey,
    useParams,
    apiNavigator,
  };
};

export default useNavigation;
