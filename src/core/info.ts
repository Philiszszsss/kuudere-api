import { kuudere } from '../client';
import type { KuudereInfoResponse } from './types';

export const kuudereInfo = async (id: string) => {
  const response = await kuudere.get(`anime/${id}`).json<KuudereInfoResponse>();

  return response.data;
};
