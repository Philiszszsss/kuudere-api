import { kuudereApi } from '../client';
import { formatEpisodes } from '../helpers/format';
import type { KuudereWatchResponse } from './types';

export const kuudereEpisodes = async (id: string) => {
  // Fetch first episode watch page to extract all episodes.
  const response = await kuudereApi.get(`watch/${id}/1`).json<KuudereWatchResponse>();

  return await formatEpisodes(id, response);
};
