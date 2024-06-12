import { ChangeEvent } from 'react';

export function getFileFromInput(e: ChangeEvent<HTMLInputElement>) {
  const files = (e.target as HTMLInputElement).files;

  if (files && files.length > 0) {
    return files[0];
  } else {
    return null;
  }
}
