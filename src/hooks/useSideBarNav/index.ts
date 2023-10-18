import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import i18next from "i18next";
import { usePathname } from "next/navigation";
import { TmenuItemLink, TmenuItemLinkParams } from "types/links";

const useSideBarNav = () => {
  const pathname = usePathname();

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
      return true;
    }

    return menuItem.children?.filter((i) => i.link === pathname).length
      ? true
      : false;
  };

  return {
    fetchAdminMenuItems,
    isActiveMenuItem,
    pathname,
  };
};

export default useSideBarNav;
