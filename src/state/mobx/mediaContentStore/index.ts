import { T_MediaContentFields } from "types/media-content";

class mediaContentStore {
  selectedMediaContent: T_MediaContentFields | null = null;

  constructor() {}

  setSelectedMediaContent = (selectedMediaContent: T_MediaContentFields) => {
    this.selectedMediaContent = selectedMediaContent;
  };
}

const MediaContentStore = new mediaContentStore();

export default MediaContentStore;
