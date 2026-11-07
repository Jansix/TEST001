import { array, normalizeLocation, type ForecastLocation } from '../lib/cwa-weather.js';

type Payload = { fetchedAt: string; source: string; locations: ReturnType<typeof normalizeLocation>[] };
let cached: Payload | undefined;
let pending: Promise<Payload> | undefined;
const MAX_CACHE = 15 * 60 * 1000;
const MAX_STALE = 6 * 60 * 60 * 1000;
async function requestData(url: string, key: string) {
  const target = new URL(url);
  target.searchParams.set('Authorization', key);
  target.searchParams.set('format', 'JSON');
  const response = await fetch(target, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('CWA request failed');
  return response.json();
}
async function load(key: string): Promise<Payload> {
  const [forest, towns] = await Promise.all([
    requestData('https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/F-B0053-059', key),
    requestData('https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-D0047-029', key),
  ]);
  const forests = array<ForecastLocation>(forest.cwaopendata.Dataset.Locations.Location);
  const townLocations = array<{Location: ForecastLocation[]}>(towns.records.Locations).flatMap((group) => array(group.Location));
  const targets = [forests.find((location) => location.LocationName === '阿里山國家森林遊樂區'), townLocations.find((location) => location.LocationName === '竹崎鄉'), townLocations.find((location) => location.LocationName === '太保市')];
  const now = Date.now();
  return {
    fetchedAt: new Date(now).toISOString(),
    source: '中央氣象署',
    locations: targets.map((location) => {
      if (!location) throw new Error('Forecast location unavailable');
      return normalizeLocation(location, now);
    }),
  };
}
export default async function handler(req: {method?: string}, res: {setHeader(name: string, value: string): void; status(code: number): any; json(value: unknown): void}) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({error: 'Method not allowed'});
  }
  const key = process.env.CWA_API_KEY;
  if (!key) return res.status(503).json({error: 'Weather service not configured'});
  try {
    if (!cached || Date.now() - Date.parse(cached.fetchedAt) > MAX_CACHE) {
      pending ??= load(key).finally(() => { pending = undefined; });
      cached = await pending;
    }
    res.setHeader('Cache-Control', 'public, s-maxage=900');
    return res.status(200).json({...cached, stale: false});
  } catch {
    res.setHeader('Cache-Control', 'no-store');
    if (cached && Date.now() - Date.parse(cached.fetchedAt) < MAX_STALE) return res.status(200).json({...cached, stale: true});
    return res.status(502).json({error: 'Weather temporarily unavailable'});
  }
}
