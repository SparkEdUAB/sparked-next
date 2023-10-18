import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import i18next from "i18next";
import { usePathname } from "next/navigation";

const useSideBarNav = () => {
  const pathname = usePathname();

  const fetchAdminMenuItems = () => {
    const menuItems = [];

    for (const menuItem in ADMIN_LINKS) {
      const enrty = ADMIN_LINKS[menuItem];
      menuItems.push(enrty);
    }

    return menuItems;
  };

  return {
    fetchAdminMenuItems,
    pathname,
  };
};

export default useSideBarNav;
