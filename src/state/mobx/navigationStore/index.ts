import { T_ChildMenuItemLinkParams, T_MenuItemLinkParams } from 'types/navigation/links';

class navigationStore {
  activeMenuItem: T_MenuItemLinkParams | T_ChildMenuItemLinkParams | null = null;

  constructor() {}

  setActiveMenuItem = (activeMenuItem: T_MenuItemLinkParams | T_ChildMenuItemLinkParams) => {
    this.activeMenuItem = activeMenuItem;
  };
}

const NavigationStore = new navigationStore();

export default NavigationStore;
