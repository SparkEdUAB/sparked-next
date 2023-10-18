import { TmenuItemLink } from "types/links";
import {
  HiChartPie,
  HiFilm,
  HiUserGroup,
  HiOutlineBookOpen,
  HiOutlineBookmarkAlt,
  HiTrendingUp,
  HiChatAlt,
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
    index: 1,
  },
  courses: {
    link: "/courses",
    roles: ["admin"],
    label: i18next.t("courses"),
    key: "admin_home",
    icon: HiOutlineBookOpen,
    index: 2,
  },
  topics: {
    link: "/topics",
    roles: ["admin"],
    label: i18next.t("topics"),
    key: "admin_home",
    icon: HiOutlineBookmarkAlt,
    index: 3,
  },
  library: {
    link: "/users",
    roles: ["admin"],
    label: i18next.t("library"),
    key: "admin_home",
    icon: HiFilm,
    index: 4,
  },
  statistics: {
    link: "/statistics",
    roles: ["admin"],
    label: i18next.t("statistics"),
    key: "admin_home",
    icon: HiTrendingUp,
    index: 5,
  },
  feedback: {
    link: "/feedback",
    roles: ["admin"],
    label: i18next.t("feedback"),
    key: "admin_home",
    icon: HiChatAlt,
    index: 6,
  },
};
