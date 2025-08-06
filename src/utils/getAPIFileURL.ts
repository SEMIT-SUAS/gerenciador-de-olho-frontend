import { API_BASE_URL } from '@/config/api';

export function getAPIFileURL(filePath: string) {
  const fileName = filePath.split('uploads/').pop();

  if (!fileName) {
    throw new Error('Invalid file path');
  }

  return `${API_BASE_URL}/arquivo/upload/${fileName}`;
}
