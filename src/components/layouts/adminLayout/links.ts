import i18next from "i18next";
import {
  HiBookOpen,
  HiBookmarkAlt,
  HiChartPie,
  HiChatAlt,
  HiDocumentReport,
  HiFilm,
  HiLibrary,
  HiTrendingUp,
  HiUserGroup,
} from "react-icons/hi";
import { TmenuItemLink } from "types/links";

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
    key: "admin_users",
    icon: HiUserGroup,
    index: 1,
  },
  courses: {
    link: "/admin/courses",
    roles: ["admin"],
    label: i18next.t("courses"),
    key: "admin_courses",
    icon: HiBookOpen,
    index: 2,
    children: [
      {
        label: "create",
        key: "create",
        link: "/admin/courses/create",
        roles: ["admin"],
      },
      {
        label: "edit",
        key: "edit",
        link: "/admin/courses/edit",
        roles: ["admin"],
      },
    ],
  },
  topics: {
    link: "/admin/topics",
    roles: ["admin"],
    label: i18next.t("topics"),
    key: "admin_topics",
    icon: HiBookmarkAlt,
    index: 3,
    children: [
      {
        label: "create",
        key: "create",
        link: "/admin/topics/create",
        roles: ["admin"],
      },
      {
        label: "edit",
        key: "edit",
        link: "/admin/topics/edit",
        roles: ["admin"],
      },
    ],
  },

  statistics: {
    link: "/statistics",
    roles: ["admin"],
    label: i18next.t("statistics"),
    key: "admin_statistics",
    icon: HiTrendingUp,
    index: 5,
  },
  feedback: {
    link: "/feedback",
    roles: ["admin"],
    label: i18next.t("feedback"),
    key: "admin_feedback",
    icon: HiChatAlt,
    index: 6,
  },
  schools: {
    link: "/admin/schools",
    roles: ["admin"],
    label: i18next.t("schools"),
    key: "admin_schools",
    icon: HiLibrary,
    index: 7,
    children: [
      {
        label: "create",
        key: "create",
        link: "/admin/schools/create",
        roles: ["admin"],
      },
      {
        label: "edit",
        key: "edit",
        link: "/admin/schools/edit",
        roles: ["admin"],
      },
    ],
  },
  programs: {
    link: "/admin/programs",
    roles: ["admin"],
    label: i18next.t("programs"),
    key: "admin_programs",
    icon: HiDocumentReport,
    index: 8,
    children: [
      {
        label: "create",
        key: "create",
        link: "/admin/programs/create",
        roles: ["admin"],
      },
      {
        label: "edit",
        key: "edit",
        link: "/admin/programs/edit",
        roles: ["admin"],
      },
    ],
  },
  units: {
    link: "/admin/units",
    roles: ["admin"],
    label: i18next.t("units"),
    key: "admin_units",
    icon: HiDocumentReport,
    index: 9,
    children: [
      {
        label: "create",
        key: "create",
        link: "/admin/units/create",
        roles: ["admin"],
      },
      {
        label: "edit",
        key: "edit",
        link: "/admin/units/edit",
        roles: ["admin"],
      },
    ],
  },
  media_content: {
    link: "/admin/media-content",
    roles: ["admin"],
    label: i18next.t("media-content"),
    key: "admin_media-content",
    icon: HiDocumentReport,
    index: 9,
    children: [
      {
        label: "create",
        key: "create",
        link: "/admin/media-content/create",
        roles: ["admin"],
      },
      {
        label: "edit",
        key: "edit",
        link: "/admin/media-content/edit",
        roles: ["admin"],
      },
    ],
  },
};
