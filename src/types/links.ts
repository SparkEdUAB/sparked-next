import { ReactNode } from "react";

export type TmenuItemLink = {
  [key: string]: TmenuItemLinkParams;
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
  children?: Array<{ name: string; link: string; roles: Array<string> }>;
};
