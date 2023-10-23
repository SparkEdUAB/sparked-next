import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import NavigationStore from "@state/mobx/navigationStore";
import { usePathname, useRouter } from "next/navigation";
import {
  TbreadcrumbItems,
  TmenuItemLink,
  TmenuItemLinkParams,
} from "types/links";

const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  const { activeMenuItem } = NavigationStore;

  const fetchAdminMenuItems = () => {
    const menuItems: Array<TmenuItemLinkParams> = [];

    for (const menuItem in ADMIN_LINKS) {
      const enrty = ADMIN_LINKS[menuItem];
      menuItems.push(enrty);
    }

    return menuItems;
  };

  const isActiveMenuItem = (menuItem: TmenuItemLinkParams): boolean => {
    if (pathname === menuItem.link) {
      NavigationStore.setActiveMenuItem(menuItem);
      return true;
    }

    const childActiveMenus = menuItem.children?.filter(
      (i) => i.link === pathname
    );

    childActiveMenus?.length &&
      NavigationStore.setActiveMenuItem(childActiveMenus[0]);

    return menuItem.children && childActiveMenus?.length !== 0 ? true : false;
  };

  const generateBreadcrumbItems = (
    menuItems: TmenuItemLink,
    targetLink: string
  ) => {
    const breadcrumbItems: TbreadcrumbItems = [];

    if (!targetLink) return breadcrumbItems;
    const linkSegments = targetLink.split("/");

    linkSegments.map((_, index) => {
      for (const menuItem in menuItems) {
        const targetLinkSegment = linkSegments.slice(0, index + 1).join("/");

        if (menuItems[menuItem].link === targetLinkSegment) {
          breadcrumbItems.push({
            link: targetLinkSegment,
            label: menuItems[menuItem].label,
          });
        }
      }
    });

    return breadcrumbItems;
  };

  return {
    fetchAdminMenuItems,
    isActiveMenuItem,
    pathname,
    activeMenuItem,
    generateBreadcrumbItems,
    router,
  };
};

export default useNavigation;
