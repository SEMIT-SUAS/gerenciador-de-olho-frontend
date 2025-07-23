import { secretariasMock } from '../constants/mocks';
import type { SecretariaModel } from '../types/Secretaria';

async function getAll(): Promise<SecretariaModel[]> {
  return secretariasMock;
}

export default {
  getAll,
};
