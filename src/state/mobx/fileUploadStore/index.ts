import i18next from "i18next";
import { makeAutoObservable } from "mobx";

class fileUploadStore {
  fileUrl: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setFileUrl = (url: string) => {
    this.fileUrl = url;
  };
}

const FileUploadStore = new fileUploadStore();

export default FileUploadStore;
