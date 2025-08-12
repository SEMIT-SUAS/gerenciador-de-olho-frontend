import { BASE_API_URL } from '@/constants/baseApiURL';

export function getAPIFileURL(filePath: string) {
  const fileName = filePath.split('uploads/').pop();

  if (!fileName) {
    throw new Error('Invalid file path');
  }

  return `${BASE_API_URL}/arquivo/upload/${fileName}`;
}
