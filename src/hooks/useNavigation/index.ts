import { ADMIN_LINKS } from '@components/layouts/adminLayout/links';
import NavigationStore from '@state/mobx/navigationStore';
import { TbreadcrumbItems, TmenuItemLink, TmenuItemLinkParams } from 'types/links';
import { useParams, usePathname } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';

const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { activeMenuItem } = NavigationStore;

  const fetchAdminMenuItems = () => {
    const menuItems: Array<TmenuItemLinkParams> = [];

    for (const menuItem in ADMIN_LINKS) {
      const entry = ADMIN_LINKS[menuItem as keyof TmenuItemLink];
      menuItems.push(entry);
    }

    return menuItems;
  };

  const isActiveMenuItem = (menuItem: TmenuItemLinkParams): boolean => {
    if (pathname === menuItem.link) {
      NavigationStore.setActiveMenuItem(menuItem);
      return true;
    }

    const childActiveMenus = menuItem.children?.filter((i) => i.link === pathname);

    childActiveMenus?.length && NavigationStore.setActiveMenuItem(childActiveMenus[0]);

    return menuItem.children && childActiveMenus?.length !== 0 ? true : false;
  };

  const generateBreadcrumbItems = (menuItems: TmenuItemLink, targetLink: string) => {
    const breadcrumbItems: TbreadcrumbItems = [];

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

  const getChildLinkByKey = (key: string, parentLink: TmenuItemLinkParams) => {
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
