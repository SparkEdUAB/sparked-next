export function removeFileExtension(fileName: string) {
  let parts = fileName.split('.');

  if (parts.length < 2) {
    return fileName;
  } else {
    return parts.slice(0, parts.length - 1).join('.');
  }
}
