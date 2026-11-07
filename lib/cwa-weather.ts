export type TimeEntry = {
  DataTime?: string;
  StartTime?: string;
  EndTime?: string;
  ElementValue: Record<string, string> | Record<string, string>[];
};
export type ForecastLocation = {
  LocationName: string;
  WeatherElement: { ElementName: string; Time: TimeEntry[] }[];
};
export function array<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
const start = (entry: TimeEntry) => Date.parse(entry.DataTime || entry.StartTime || '');
export function selectPeriod(entries: TimeEntry[], now: number): TimeEntry | undefined {
  const ordered = [...entries].filter((entry) => Number.isFinite(start(entry))).sort((a, b) => start(a) - start(b));
  return ordered.find((entry) => entry.EndTime && start(entry) <= now && Date.parse(entry.EndTime) > now)
    || ordered.find((entry, index) => entry.DataTime && start(entry) <= now && start(entry) + 3 * 3600000 > now && (!ordered[index + 1] || start(ordered[index + 1]) > now))
    || ordered.find((entry) => start(entry) >= now);
}
export function normalizeLocation(location: ForecastLocation, now: number) {
  const entries = (name: string) => array(location.WeatherElement).find((element) => element.ElementName === name)?.Time || [];
  const get = (name: string, key: string) => {
    const period = selectPeriod(array(entries(name)), now);
    const value = period && array(period.ElementValue)[0]?.[key];
    return value && value !== '-99' && value !== '-999' && value !== 'NA' ? value : null;
  };
  const numeric = (value: string | null) => value !== null && value.trim() !== '' && Number.isFinite(Number(value)) ? Number(value) : null;
  const temperature = selectPeriod(entries('溫度'), now);
  if (!temperature) throw new Error('No valid forecast period');
  const anchor = Math.max(now, start(temperature));
  const temps = entries('溫度').filter((entry) => start(entry) >= anchor && start(entry) < anchor + 24 * 3600000)
    .map((entry) => numeric(array(entry.ElementValue)[0]?.Temperature ?? null)).filter((value): value is number => value !== null);
  const temp = numeric(get('溫度', 'Temperature'));
  if (temp === null) throw new Error('Missing temperature');
  const rain = get('3小時降雨機率', 'ProbabilityOfPrecipitation');
  const humidity = get('相對濕度', 'RelativeHumidity');
  const wind = get('風速', 'WindSpeed');
  const period = selectPeriod(entries('天氣現象'), now) || temperature;
  return {
    forecastLocation: location.LocationName,
    temp,
    tempMin: temps.length ? Math.min(temp, ...temps) : temp,
    tempMax: temps.length ? Math.max(temp, ...temps) : temp,
    condition: get('天氣現象', 'Weather') || '未提供',
    rainProb: rain === null ? '未提供' : `${rain}%`,
    humidity: humidity === null ? '未提供' : `${humidity}%`,
    wind: wind === null ? '未提供' : `${wind} m/s`,
    uvIndex: '未提供',
    sunrise: '未提供',
    sunset: '未提供',
    validFrom: period.StartTime || period.DataTime,
    validTo: period.EndTime || new Date(start(period) + 3600000).toISOString(),
    temperatureTime: temperature.DataTime || temperature.StartTime,
    clothingTip: temp < 18 ? '氣溫偏涼，請攜帶保暖外套；山區日夜溫差大，並備妥雨具。' : '請依最新預報調整穿著，備妥雨具；室內外活動可攜帶薄外套。',
  };
}
