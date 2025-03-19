

export enum UploadProcessSteps {
    SelectDependencies,
    SelectFiles,
    EditResources
}

export type ResourceData = {
    file: File;
    name: string;
    description: string;
};

export type UploadProgress = {
    successful: number;
    outOf: number;
};
