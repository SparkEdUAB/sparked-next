import { TchildMenuItemLinkParams, TmenuItemLinkParams } from "types/links";

class navigationStore {
  activeMenuItem: TmenuItemLinkParams | TchildMenuItemLinkParams | null = null;

  constructor() {}

  setActiveMenuItem = (
    activeMenuItem: TmenuItemLinkParams | TchildMenuItemLinkParams
  ) => {
    this.activeMenuItem = activeMenuItem;
  };
}

const NavigationStore = new navigationStore();

export default NavigationStore;
