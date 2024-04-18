declare module '@intelllex/react-pdf' {
  export interface ReactPDFProps {
    /** The URL of PDF Document you want to display. */
    url: string;
    /** Show progress bar on top when loading PDF Document */
    showProgressBar?: boolean;
    /** Show the useful toolbox on PDF Pages */
    showToolbox?: boolean;
    /** Callback with `page` param when changing Page Number */
    onChangePage?: (page: number) => void;
    /** Callback when clicking on Zoom In button */
    onZoomIn?: () => void;
    /** Callback when clicking on Zoom Out button */
    onZoomOut?: () => void;
    /** Callback with `progress` param when loading PDF */
    onProgress?: (progress: number) => void;
    /** Callback with `isShowThumbSidebar` param when toggling Thumbnail sidebar */
    onToggleThumbnail?: (isShowThumbSidebar: boolean) => void;
  }

  const ReactPDF: React.FC<ReactPDFProps>;

  export default ReactPDF;
}
