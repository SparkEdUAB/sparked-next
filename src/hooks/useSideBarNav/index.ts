import { ADMIN_LINKS } from "@components/layouts/adminLayout/links";
import i18next from "i18next";

const useSideBarNav = () => {
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
  };
};

export default useSideBarNav;
