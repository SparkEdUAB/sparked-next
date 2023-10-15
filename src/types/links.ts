import { ReactNode } from "react";

export type TmenuItemLink = {
  [key: string]: {
    link: string;
    roles: Array<string>;
    label: string;
    key: string;
    icon: ReactNode;
    index: number;
    hasDivider?: string;
    hasBadge?: boolean;
    badgeLabel?:String
  };
};
