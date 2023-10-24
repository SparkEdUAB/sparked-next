import i18next from "i18next";
import { makeAutoObservable } from "mobx";

class uiStore {
  confirmDialogVisibility: boolean = false;
  confirmDialogStatus: boolean = false;
  isLoading: boolean = false;
  confirmDialogTitle: string = i18next.t("confirm_action");

  constructor() {
    makeAutoObservable(this);
  }

  setconfirmDialogTitle = (title: string) => {
    this.confirmDialogTitle = title;
  };
  setConfirmDialogVisibility = (status: boolean) => {
    this.confirmDialogVisibility = status;
  };
  setConfirmDialogStatus = (confirmDialogStatus: boolean) => {
    this.confirmDialogStatus = confirmDialogStatus;

    setTimeout(() => {
      //set to false to avoid duplicate actions
      this.confirmDialogStatus = false;
    }, 3000);
  };
  setLoaderStatus = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}

const UiStore = new uiStore();

export default UiStore;
