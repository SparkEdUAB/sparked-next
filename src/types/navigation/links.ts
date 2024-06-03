export type T_MenuItemLink = {
  home: T_MenuItemLinkParams;
  users: T_MenuItemLinkParams;
  courses?: T_MenuItemLinkParams;
  grades: T_MenuItemLinkParams;
  subjects: T_MenuItemLinkParams;
  topics: T_MenuItemLinkParams;
  statistics: T_MenuItemLinkParams;
  feedback: T_MenuItemLinkParams;
  // schools: T_MenuItemLinkParams;
  // programs: T_MenuItemLinkParams;
  units: T_MenuItemLinkParams;
  media_content: T_MenuItemLinkParams;
};

export type T_ChildMenuItemLinkParams = {
  label: string;
  link: string;
  key?: string;
  roles: Array<string>;
};

export type T_MenuItemLinkParams = {
  link: string;
  roles: Array<string>;
  label: string;
  key: string;
  icon: any;
  index: number;
  hasDivider?: string;
  hasBadge?: boolean;
  badgeLabel?: String;
  children?: Array<T_ChildMenuItemLinkParams>;
};

export type T_BreadcrumbItems = Array<{
  link: string;
  label: string;
}>;
