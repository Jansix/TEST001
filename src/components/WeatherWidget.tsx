import React, { useRef, useState } from 'react';
import { WEATHER_FORECAST } from '../data/tourData';
import { MapleLeaf, StarSparkle } from './MapleLeafStars';
import {
  Sun,
  Sunrise,
  Sunset,
  Droplets,
  Wind,
  Umbrella,
  ShieldCheck,
  Compass,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const goToLocation = (index: number) => {
    const container = carouselRef.current;
    const slide = container?.children[index] as HTMLElement | undefined;
    if (!container || !slide) return;
    container.scrollTo({
      left: container.scrollLeft + slide.getBoundingClientRect().left - container.getBoundingClientRect().left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  };

  return (
    <section id="weather" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="bg-gradient-to-b from-[#FCF9FD] via-white to-[#FAF4FB] rounded-3xl border border-[#EADEF2] p-4 sm:p-8 shadow-[0_4px_20px_rgba(90,61,115,0.04)]">
        {/* Section Header: Clean title "天氣" as requested */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#EADEF2]">
          <div>
            <h3 className="text-xl sm:text-2xl font-serif-tc font-bold text-[#3A2052] flex items-center gap-2">
              <span>天氣</span>
              <MapleLeaf size={18} color="amber" />
              <StarSparkle size={13} color="#D97706" />
            </h3>
          </div>

        </div>

        <div className="relative mt-5">
        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="輪播"
          aria-label="各地天氣，左右滑動切換"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
              event.preventDefault();
              goToLocation(Math.max(0, Math.min(WEATHER_FORECAST.length - 1, selectedLocation + (event.key === 'ArrowRight' ? 1 : -1))));
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
          className="weather-carousel flex gap-3 overflow-x-auto snap-x snap-mandatory overscroll-x-contain pb-2 rounded-2xl focus-visible:outline-2 focus-visible:outline-[#7D6895]"
        >
        {WEATHER_FORECAST.map((current, index) => (
        <article key={current.location} role="group" aria-roledescription="投影片" aria-label={`${index + 1} / ${WEATHER_FORECAST.length}：${current.location}`} className="min-w-0 shrink-0 basis-[94%] sm:basis-full snap-start snap-always rounded-2xl border border-[#E5D7EE] p-3 sm:p-5">
        {/* Weather Card Content: Luminous & Warm */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Main Temperature & Location Badge: Warm Dawn Mist Palette */}
          <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-7 rounded-2xl bg-gradient-to-br from-[#FAF3FC] via-[#F4EAF9] to-[#EDE0F6] border border-[#DECFEB] text-[#3D2555] shadow-xs relative overflow-hidden">
            {/* Watermark leaf */}
            <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none">
              <MapleLeaf size={160} color="amber" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between text-xs text-[#735A8B] mb-2">
                <span className="font-mono bg-white/70 px-2.5 py-0.5 rounded-md border border-[#EADEF2] font-semibold">
                  {current.elevation}
                </span>
                <span className="flex items-center gap-1 text-[#D97706] font-semibold">
                  <Compass className="w-3.5 h-3.5" />
                  旅遊重點區
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-serif-tc font-bold text-[#351D4A] mb-3">
                {current.location}
              </h4>

              <div className="flex flex-wrap items-baseline gap-3 mb-4">
                <div className="text-5xl sm:text-6xl font-bold font-mono tracking-tight text-[#3A2052] tabular-nums">
                  {current.temp}°
                </div>
                <div className="flex flex-col text-xs text-[#6F5786]">
                  <span className="text-sm font-semibold text-[#3A2052]">
                    {current.condition}
                  </span>
                  <span>日溫差：{current.tempMin}°C ~ {current.tempMax}°C</span>
                </div>
              </div>
            </div>

            {/* Sun times strip */}
            <div className="relative z-10 pt-4 border-t border-[#DFCFEC] grid grid-cols-2 gap-3 text-xs text-[#6B5282]">
              <div className="flex items-center gap-2 bg-white/60 p-2 rounded-xl border border-[#EADEF2]/70">
                <Sunrise className="w-4 h-4 text-[#D97706] shrink-0" />
                <div>
                  <span className="text-[11px] text-[#7A648F] block">阿里山日出</span>
                  <span className="font-semibold text-[#3A2052] font-mono">{current.sunrise}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/60 p-2 rounded-xl border border-[#EADEF2]/70">
                <Sunset className="w-4 h-4 text-[#E11D48] shrink-0" />
                <div>
                  <span className="text-[11px] text-[#7A648F] block">高山日落</span>
                  <span className="font-semibold text-[#3A2052] font-mono">{current.sunset}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Meteorological Metrics & Clothing Guide */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* 4 Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-[#EADEF2] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#7A648F] mb-1">
                  <Umbrella className="w-3.5 h-3.5 text-[#6366F1]" />
                  <span>降雨機率</span>
                </div>
                <span className="text-lg font-bold font-mono text-[#3A2052] tabular-nums">
                  {current.rainProb}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EADEF2] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#7A648F] mb-1">
                  <Droplets className="w-3.5 h-3.5 text-[#3B82F6]" />
                  <span>相對濕度</span>
                </div>
                <span className="text-lg font-bold font-mono text-[#3A2052] tabular-nums">
                  {current.humidity}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EADEF2] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#7A648F] mb-1">
                  <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>紫外線指數</span>
                </div>
                <span className="text-sm font-bold font-mono text-[#3A2052]">
                  {current.uvIndex}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#EADEF2] shadow-2xs">
                <div className="flex items-center gap-1.5 text-xs text-[#7A648F] mb-1">
                  <Wind className="w-3.5 h-3.5 text-[#8B5CF6]" />
                  <span>風速狀況</span>
                </div>
                <span className="text-sm font-bold font-mono text-[#3A2052]">
                  {current.wind}
                </span>
              </div>
            </div>

            {/* Clothing Guide Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF3FC] to-white border border-[#E5D7EE]">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#EFE6F6] text-[#6A4788] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-[#6A4788]" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-[#3A2052] mb-1">
                    高山穿著導引
                  </h5>
                  <p className="text-xs sm:text-sm text-[#5B466F] leading-relaxed">
                    {current.clothingTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        </article>
        ))}
        </div>
          <div className="pointer-events-none absolute inset-x-0 top-[160px] z-10 flex justify-between -mx-3 sm:-mx-5">
            <button type="button" aria-label="上一個地點" disabled={selectedLocation === 0} onClick={() => goToLocation(selectedLocation - 1)} className="pointer-events-auto bg-white/95 shadow-md focus-visible:outline-2 focus-visible:outline-[#7D6895] flex h-11 w-11 items-center justify-center rounded-full border border-[#DECFEC] text-[#6E4B8B] disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
            <button type="button" aria-label="下一個地點" disabled={selectedLocation === WEATHER_FORECAST.length - 1} onClick={() => goToLocation(selectedLocation + 1)} className="pointer-events-auto bg-white/95 shadow-md focus-visible:outline-2 focus-visible:outline-[#7D6895] flex h-11 w-11 items-center justify-center rounded-full border border-[#DECFEC] text-[#6E4B8B] disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 mt-2" aria-label="選擇天氣地點">
          {WEATHER_FORECAST.map((location, index) => (
            <button key={location.location} type="button" aria-label={`查看${location.location}天氣`} aria-current={selectedLocation === index ? 'true' : undefined} onClick={() => goToLocation(index)} className="flex h-11 w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#7D6895]">
              <span className={`h-1.5 rounded-full transition-all ${selectedLocation === index ? 'w-6 bg-[#6E4B8B]' : 'w-1.5 bg-[#D8C6E5]'}`} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
