import ky from 'ky';

export const KUUDERE_BASE_URL = 'https://kuudere.to';

export const kuudereApi = ky.create({
  prefixUrl: `${KUUDERE_BASE_URL}/api`,
});

export const kuudere = ky.create({
  prefixUrl: KUUDERE_BASE_URL,
});
