import { ReactNode } from "react";

export type TmenuItemLink = {
  home: TmenuItemLinkParams;
  users: TmenuItemLinkParams;
  courses: TmenuItemLinkParams;
  topics: TmenuItemLinkParams;
  library: TmenuItemLinkParams;
  statistics: TmenuItemLinkParams;
  feedback: TmenuItemLinkParams;
  schools: TmenuItemLinkParams;
  programs: TmenuItemLinkParams;
  units: TmenuItemLinkParams;
};

export type TchildMenuItemLinkParams = {
  label: string;
  link: string;
  key?: string;
  roles: Array<string>;
};

export type TmenuItemLinkParams = {
  link: string;
  roles: Array<string>;
  label: string;
  key: string;
  icon: ReactNode;
  index: number;
  hasDivider?: string;
  hasBadge?: boolean;
  badgeLabel?: String;
  children?: Array<TchildMenuItemLinkParams>;
};

export type TbreadcrumbItems = Array<{
  link: string;
  label: string;
}>;
