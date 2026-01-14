import { kuudereApi } from '../client';
import { formatSearch } from '../helpers/format';
import type { KuudereSearchResponse } from './types';

export const kuuderSearch = async (query: string) => {
  const encodedQuery = encodeURIComponent(query);

  const response = await kuudereApi.get(`search?q=${encodedQuery}`).json<KuudereSearchResponse>();

  return formatSearch(response);
};
