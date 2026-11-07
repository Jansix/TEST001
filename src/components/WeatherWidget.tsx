import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WEATHER_FORECAST } from '../data/tourData';
import { MapleLeaf, StarSparkle } from './MapleLeafStars';
import {
  Droplets,
  Wind,
  Umbrella,
  ShieldCheck,
  Pause,
  Play,
  Mountain,
  TrainFront,
  Landmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  type LiveWeather = { locations: (Partial<(typeof WEATHER_FORECAST)[number]> & {forecastLocation: string; validFrom: string; validTo: string; temperatureTime: string})[]; fetchedAt: string; stale: boolean };
  const [weather, setWeather] = useState<LiveWeather | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 18000);
    let active = true;
    setLoading(true);
    setError(false);
    fetch('/api/weather', { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Unavailable');
        const result = await response.json();
        if (!Array.isArray(result.locations) || result.locations.length !== 3 || !result.locations.every((location: {temp: unknown}) => typeof location.temp === 'number')) throw new Error('Invalid forecast');
        if (active) setWeather(result);
      })
      .catch(() => { if (active) setError(true); })
      .finally(() => { window.clearTimeout(timeout); if (active) setLoading(false); });
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [retry]);
  const formatTime = (value: string) => new Intl.DateTimeFormat('zh-TW', { timeZone: 'Asia/Taipei', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
  const locations = WEATHER_FORECAST.map((metadata, index) => ({
    ...metadata,
    temp: '—' as number | string, tempMin: '—' as number | string, tempMax: '—' as number | string,
    condition: loading ? '正在取得官方預報' : '暫時無法取得預報', rainProb: '—', humidity: '—', wind: '—', uvIndex: '未提供',
    clothingTip: '山區天候多變，請備妥雨具及保暖衣物。',
    ...weather?.locations[index],
  }));
  const [selectedLocation, setSelectedLocation] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const [focused, setFocused] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(query.matches);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateMotion();
    query.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    if (carouselRef.current) observer.observe(carouselRef.current);
    return () => { observer.disconnect(); query.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);
  const goToLocation = useCallback((index: number) => {
    const container = carouselRef.current;
    const slide = container?.children[index] as HTMLElement | undefined;
    if (!container || !slide) return;
    container.scrollTo({
      left: container.scrollLeft + slide.getBoundingClientRect().left - container.getBoundingClientRect().left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }, []);
  useEffect(() => {
    if (!autoPlay || interacting || focused || detailsOpen || !visible || !pageVisible || reducedMotion) return;
    const timer = window.setTimeout(() => goToLocation((selectedLocation + 1) % WEATHER_FORECAST.length), 6000);
    return () => window.clearTimeout(timer);
  }, [autoPlay, interacting, focused, detailsOpen, visible, pageVisible, reducedMotion, selectedLocation, goToLocation]);

  return (
    <section id="weather" className="max-w-5xl mx-auto px-4 sm:px-6 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl sm:text-2xl font-serif-tc font-bold text-[#3A2052] flex items-center gap-2">
          <span>天氣</span><MapleLeaf size={18} color="amber" /><StarSparkle size={12} color="#D97706" />
        </h3>
      </div>

      <div className="grid grid-cols-[20px_minmax(0,1fr)_20px] sm:grid-cols-[28px_minmax(0,1fr)_28px] items-center"
        onPointerEnter={(event) => { if (event.pointerType === 'mouse') setInteracting(true); }}
        onPointerLeave={() => setInteracting(false)}
        onPointerDown={() => setInteracting(true)}
        onPointerUp={() => setInteracting(false)}
        onPointerCancel={() => setInteracting(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}
      >
        <button type="button" aria-label="上一個地點" disabled={selectedLocation === 0} onClick={() => goToLocation(selectedLocation - 1)} className="relative z-10 -ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-[#DECFEC] bg-white text-[#6E4B8B] shadow-sm disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#7D6895]">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="輪播"
          aria-label="各地天氣，左右滑動切換"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              goToLocation(Math.max(0, Math.min(locations.length - 1, selectedLocation + (event.key === 'ArrowRight' ? 1 : -1))));
            }
          }}
          onScroll={() => {
            const container = carouselRef.current;
            if (!container) return;
            const left = container.getBoundingClientRect().left;
            let nearest = 0;
            let distance = Infinity;
            Array.from(container.children).forEach((slide, index) => {
              const delta = Math.abs(slide.getBoundingClientRect().left - left);
              if (delta < distance) { distance = delta; nearest = index; }
            });
            setSelectedLocation(nearest);
          }}
          className="weather-carousel flex gap-3 overflow-x-auto snap-x snap-mandatory overscroll-x-contain rounded-3xl focus-visible:outline-2 focus-visible:outline-[#7D6895]"
        >
          {locations.map((current, index) => (
            <article key={current.location} role="group" aria-roledescription="投影片" aria-label={`${index + 1} / ${locations.length}：${current.location}`} className="min-w-0 shrink-0 basis-full snap-start snap-always rounded-3xl border border-[#E2D2ED] bg-gradient-to-br from-[#FAF3FC] via-[#F4EAF9] to-[#EDE0F6] overflow-hidden">
              <div className="relative h-32 sm:h-44 overflow-hidden bg-[#D9CCE4]">
                <img src={['/images/hero_sunrise.jpg', '/images/fenqihu.jpg', '/images/npm_south.jpg'][index]} alt={['阿里山日出與層疊山巒', '奮起湖山城風景', '故宮南院建築風景'][index]} loading="lazy" draggable={false} className="h-full w-full object-cover select-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#351D4A]/65 via-transparent to-transparent pointer-events-none" />
                <span aria-hidden="true" className="absolute bottom-3 right-4 rounded-full bg-white/20 backdrop-blur-sm p-2 text-white">{index === 0 ? <Mountain className="h-6 w-6" /> : index === 1 ? <TrainFront className="h-6 w-6" /> : <Landmark className="h-6 w-6" />}</span>
                <span className="absolute bottom-3 left-5 text-[10px] tracking-[0.25em] text-white/90">{['MOUNTAIN MIST', 'FOREST RAILWAY', 'ART & CULTURE'][index]}</span>
              </div>
              <div className="p-5 sm:p-8">
              <div className="flex items-center justify-between gap-2 text-xs text-[#735A8B]">
                <span>{current.elevation}</span>

              </div>
              <h4 className="mt-2 text-xl sm:text-2xl font-serif-tc font-bold text-[#351D4A]">{['阿里山', '奮起湖', '故宮南院'][index]}</h4>
              <p className="mt-1 text-xs text-[#735A8B] leading-relaxed">{['國家森林遊樂區', '山城老街・森林鐵道', '國立故宮博物院南部院區'][index]}</p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex items-start text-[#3A2052]"><span className="text-6xl sm:text-7xl font-semibold tracking-tighter tabular-nums">{current.temp}</span><span className="mt-1 text-2xl">°C</span></div>
                <div className="min-w-0 text-right">
                  <p className="text-sm sm:text-base font-semibold text-[#3A2052] break-words">{current.condition}</p>
                  <p className="mt-1 text-xs text-[#735A8B]">{current.tempMin}° ~ {current.tempMax}°</p>
                  <p className="text-[11px] text-[#735A8B]">未來 24 小時</p>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[#DDCCE8] border-y border-[#DDCCE8] py-4 mt-5">
                {[
                  {label:'降雨',value:current.rainProb,Icon:Umbrella},
                  {label:'濕度',value:current.humidity,Icon:Droplets},
                  {label:'風速',value:current.wind,Icon:Wind},
                ].map(({label,value,Icon}) => (
                  <div key={label} className="min-w-0 text-center px-1">
                    <div className="flex items-center justify-center gap-1 text-xs text-[#735A8B]"><Icon className="h-3.5 w-3.5 shrink-0" />{label}</div>
                    <p className="mt-1.5 text-sm sm:text-lg font-semibold text-[#3A2052] tabular-nums break-words">{value}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2 mt-4 text-sm leading-relaxed text-[#5B466F]">
                <ShieldCheck className="h-4 w-4 shrink-0 mt-1" /><p>{current.clothingTip}</p>
              </div>
              {index === 1 && <p className="mt-3 rounded-lg bg-white/60 p-2.5 text-xs leading-relaxed text-[#78582F]">採竹崎鄉區域預報，非奮起湖現場溫度，山區氣溫可能不同。</p>}

              {weather?.locations[index] && <details onToggle={() => setDetailsOpen(Boolean(carouselRef.current?.querySelector('details[open]')))} className="mt-4 border-t border-[#DDCCE8] pt-1 text-xs text-[#735A8B]">
                <summary className="cursor-pointer min-h-11 flex items-center justify-between gap-2"><span>預報地點與時段</span><ChevronDown className="h-4 w-4" /></summary>
                <div className="pb-2 space-y-1 leading-relaxed">
                  <p>預報地點：{weather.locations[index].forecastLocation}</p>
                  <p>{formatTime(weather.locations[index].validFrom)}～{formatTime(weather.locations[index].validTo)}</p>
                  <p>溫度時點：{formatTime(weather.locations[index].temperatureTime)}</p>
                </div>
              </details>}
              </div>
            </article>
          ))}
        </div>
        <button type="button" aria-label="下一個地點" disabled={selectedLocation === locations.length - 1} onClick={() => goToLocation(selectedLocation + 1)} className="relative z-10 -ml-4 sm:-ml-2 flex h-11 w-11 items-center justify-center rounded-full border border-[#DECFEC] bg-white text-[#6E4B8B] shadow-sm disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-[#7D6895]">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center justify-center" aria-label="選擇天氣地點">
        {locations.map((location, index) => (
          <button key={location.location} type="button" aria-label={`查看${location.location}天氣`} aria-current={selectedLocation === index ? 'true' : undefined} onClick={() => goToLocation(index)} className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#7D6895]">
            <span className={`h-1.5 rounded-full transition-all ${selectedLocation === index ? 'w-6 bg-[#6E4B8B]' : 'w-1.5 bg-[#D8C6E5]'}`} />
          </button>
        ))}
        {!reducedMotion && <button type="button" aria-label={autoPlay ? '暫停自動輪播' : '啟動自動輪播'} aria-pressed={autoPlay} onClick={() => setAutoPlay((value) => !value)} className="flex h-11 w-11 items-center justify-center rounded-full text-[#735A8B] focus-visible:outline-2 focus-visible:outline-[#7D6895]">{autoPlay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button>}
      </div>
      <div className="text-xs leading-relaxed text-[#735A8B] px-5 sm:px-7" aria-live="polite">
        <p>{weather ? `中央氣象署 · 更新 ${formatTime(weather.fetchedAt)}` : loading ? '正在取得中央氣象署最新預報…' : '目前無法取得官方天氣資料。'}</p>
        <p>最新可用預報，非現場觀測或指定旅遊日期預報。</p>
        {(error || weather?.stale) && <p className="mt-1 text-[#92400E]">{weather ? '更新暫時失敗，顯示上次成功取得的預報。' : '請稍後重試。'}<button type="button" disabled={loading} onClick={() => setRetry((value) => value + 1)} className="inline-flex min-h-11 items-center px-3 font-semibold underline disabled:opacity-50">重新取得</button></p>}
      </div>
    </section>
  );
};
