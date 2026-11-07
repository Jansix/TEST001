import {test} from 'node:test';
import assert from 'node:assert/strict';
import {normalizeLocation, selectPeriod, type ForecastLocation} from './cwa-weather';
const now = Date.parse('2026-11-07T10:30:00+08:00');
test('selects active interval and ignores expired periods', () => {
  const expired = {StartTime:'2026-11-07T06:00:00+08:00',EndTime:'2026-11-07T09:00:00+08:00',ElementValue:{Weather:'old'}};
  const active = {StartTime:'2026-11-07T09:00:00+08:00',EndTime:'2026-11-07T12:00:00+08:00',ElementValue:{Weather:'new'}};
  assert.equal(selectPeriod([expired,active],now),active);
  assert.equal(selectPeriod([expired],now),undefined);
});
test('normalizes object and array values without fabricating missing metrics', () => {
  const location: ForecastLocation = {LocationName:'Example',WeatherElement:[
    {ElementName:'溫度',Time:[{DataTime:'2026-11-07T10:00:00+08:00',ElementValue:{Temperature:'16'}},{DataTime:'2026-11-07T11:00:00+08:00',ElementValue:[{Temperature:'18'}]}]},
    {ElementName:'3小時降雨機率',Time:[{StartTime:'2026-11-07T09:00:00+08:00',EndTime:'2026-11-07T12:00:00+08:00',ElementValue:[{ProbabilityOfPrecipitation:'0'}]}]},
  ]};
  const result=normalizeLocation(location,now);
  assert.equal(result.temp,16);
  assert.equal(result.tempMax,18);
  assert.equal(result.rainProb,'0%');
  assert.equal(result.humidity,'未提供');
  assert.equal(result.sunrise,'未提供');
  assert.throws(() => normalizeLocation(location,now+10*24*3600000));
});
