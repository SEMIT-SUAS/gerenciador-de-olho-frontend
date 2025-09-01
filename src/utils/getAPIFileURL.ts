export function getAPIFileURL(filePath: string | null | undefined): string {
  if (!filePath) {
    return '';
  }

  const parts = filePath.split('uploads/');
  const fileName = parts.length > 1 ? parts.pop() : parts[0];

  if (!fileName) {
    return '';
  }

  return `u/${fileName}`;
}
