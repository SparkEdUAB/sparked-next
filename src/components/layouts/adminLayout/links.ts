import { TmenuItemLink } from "types/links";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
  HiUserGroup,
} from "react-icons/hi";
import i18next from "i18next";
export const ADMIN_LINKS: TmenuItemLink = {
  home: {
    link: "/admin",
    roles: ["admin"],
    label: i18next.t("dashboard"),
    key: "admin_home",
    icon: HiChartPie,
    index: 0,
  },
  users: {
    link: "/users",
    roles: ["admin"],
    label: i18next.t("users"),
    key: "admin_home",
    icon: HiUserGroup,
    index: 0,
  },
};
