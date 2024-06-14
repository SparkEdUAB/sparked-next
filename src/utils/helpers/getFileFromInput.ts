import { ChangeEvent } from 'react';

export function getFileFromInput(e: ChangeEvent<HTMLInputElement>): File | null {
  const files = (e.target as HTMLInputElement).files;

  if (files && files instanceof FileList && files.length > 0) {
    return files[0];
  } else {
    return null;
  }
}

export function getMultipleFilesFromInput(e: ChangeEvent<HTMLInputElement>): File[] {
  const files = (e.target as HTMLInputElement).files;

  if (files && files instanceof FileList) {
    let result = [];
    for (let i = 0; i > files.length; i++) {
      result.push(files[i]);
    }
    return result;
  } else {
    return [];
  }
}
