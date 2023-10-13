import { TmenuItemLink } from "types/links";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiViewBoards,
} from "react-icons/hi";
export const ADMIN_LINKS: TmenuItemLink = {
  admin_home: {
    link: "/admin",
    roles: ["admin"],
    label: "Admin",
    key: "admin_home",
    icon: HiChartPie,
  },
};
