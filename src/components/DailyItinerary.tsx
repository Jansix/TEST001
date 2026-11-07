import React, { useState } from 'react';
import { SCHEDULE_ITEMS } from '../data/tourData';
import { ScheduleItem } from '../types/tour';
import { MapleLeaf, StarSparkle, StarFivePoint } from './MapleLeafStars';
import {
  MapPin,
  Utensils,
  ChevronDown,
  ChevronUp,
  Bus,
  Train,
  Mountain,
  Hotel,
  Sun,
  Moon,
  Landmark,
  Footprints,
} from 'lucide-react';

export const DailyItinerary: React.FC = () => {
  const [activeView, setActiveView] = useState<'d1' | 'd2'>('d1');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const day1Items = SCHEDULE_ITEMS.filter((item) => item.day === 1);
  const day2Items = SCHEDULE_ITEMS.filter((item) => item.day === 2);

  const toggleExpand = (id: string) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Icon selector based on activity type for authentic poster styling
  const getItemIcon = (item: ScheduleItem) => {
    if (item.timeRange === '傍晚') return <Moon className="w-4 h-4 text-[#8A5DA8]" />;
    if (item.activity.includes('專車') || item.activity.includes('接駁'))
      return <Bus className="w-4 h-4 text-[#8A5DA8]" />;
    if (item.activity.includes('火車')) return <Train className="w-4 h-4 text-[#8A5DA8]" />;
    if (item.activity.includes('日出') || item.activity.includes('玉山'))
      return <Sun className="w-4 h-4 text-[#D97706]" />;
    if (item.activity.includes('午餐') || item.activity.includes('晚餐') || item.activity.includes('早餐'))
      return <Utensils className="w-4 h-4 text-[#D97706]" />;
    if (item.activity.includes('入住') || item.activity.includes('退房') || item.activity.includes('賓館'))
      return <Hotel className="w-4 h-4 text-[#8A5DA8]" />;
    if (item.activity.includes('博物館') || item.activity.includes('故宮'))
      return <Landmark className="w-4 h-4 text-[#8A5DA8]" />;
    if (item.activity.includes('森林浴')) return <Footprints className="w-4 h-4 text-[#8A5DA8]" />;
    return <Mountain className="w-4 h-4 text-[#8A5DA8]" />;
  };

  const detailIds = SCHEDULE_ITEMS.filter((item) => item.detailNote).map((item) => item.id);
  const allExpanded = detailIds.every((id) => expandedIds.has(id));

  const renderExpandSwitch = () => (
    <button
      type="button"
      aria-expanded={allExpanded}
      aria-label={allExpanded ? '收起全部行程說明' : '展開全部行程說明'}
      onClick={() => setExpandedIds(allExpanded ? new Set() : new Set(detailIds))}
      className="inline-flex h-12 w-14 shrink-0 items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D6895]"
    >
      {allExpanded ? <ChevronUp aria-hidden="true" className="h-6 w-6 text-[#6E4B8B]" /> : <ChevronDown aria-hidden="true" className="h-6 w-6 text-[#6E4B8B]" />}
    </button>
  );

  const renderTimelineList = (items: ScheduleItem[]) => (
    <div className="space-y-3.5 relative">
      {/* Delicate vertical timeline guide line */}
      <div className="absolute left-[63px] sm:left-[82px] top-6 bottom-6 w-[1.5px] bg-gradient-to-b from-[#E2D4EB] via-[#DBC9E5] to-[#E2D4EB] pointer-events-none" />

      {items.map((item) => {
        const hasDetails = Boolean(item.detailNote);
        const isExpanded = hasDetails && expandedIds.has(item.id);

        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-150 overflow-hidden relative z-10 ${
              isExpanded
                ? 'bg-white border-[#C9B2DB] shadow-sm ring-1 ring-[#EADEF2]'
                : 'bg-white/90 hover:bg-white border-[#EADEF2] hover:border-[#D1BEE0] shadow-2xs'
            }`}
          >
            {/* Timeline Row */}
            <div
              onClick={() => hasDetails && toggleExpand(item.id)}
              className={`p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-2 sm:gap-3 select-none ${
                hasDetails ? 'cursor-pointer hover:bg-[#FAF4FC]/60' : 'cursor-default'
              }`}
            >
              {/* Left Column: Time Pill + Icon + Activity Details */}
              <div className="flex items-start sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                {/* Time Pill matching reference poster */}
                <div className="inline-flex items-center justify-center px-1 sm:px-3 py-1.5 rounded-full bg-[#EFE7F6] text-[#553B70] text-[10px] sm:text-xs font-semibold font-mono tabular-nums whitespace-nowrap w-[100px] sm:w-[132px] border border-[#DECFEC]/60 shrink-0 shadow-2xs">
                  {item.timeRange}
                </div>

                {/* Activity Icon */}
                <div className="hidden sm:flex w-8 h-8 rounded-full bg-[#FAF3FC] border border-[#EADEF2] items-center justify-center shrink-0">
                  {getItemIcon(item)}
                </div>

                {/* Activity Name & Location */}
                <div className="flex flex-col gap-1 flex-1 min-w-0">
                  <span className="text-sm sm:text-base font-bold text-[#351D4A] font-serif-tc break-words">
                    {item.activity}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[#7B668F]">
                    <MapPin className="w-3 h-3 text-[#A855F7]" />
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Right Column: Meal Tag & Expand Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                {item.mealNote && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#92400E] bg-[#FFFBEB] px-2.5 py-1 rounded-md border border-[#FDE68A] font-medium">
                    <Utensils className="w-3 h-3 text-[#D97706]" />
                    {item.mealNote.split('：')[0]}
                  </span>
                )}

                {hasDetails && (
                  <div className="p-1 rounded-lg text-[#7A5D94] hover:bg-[#F3EAF8] transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Content: 行程說明 */}
            {isExpanded && item.detailNote && (
              <div className="px-4 pb-4 pt-1 border-t border-[#F1E6F7] bg-[#FAF5FB]/80 animate-in fade-in duration-150">
                <div className="mt-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6E4B8B] mb-1.5">
                    <StarSparkle size={10} color="#D97706" />
                    <span>行程說明：</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4E3963] leading-relaxed bg-white p-3 rounded-xl border border-[#E5D7EE]">
                    {item.detailNote}
                  </p>
                  {item.mealNote && (
                    <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#92400E] bg-[#FFFBEB] px-3 py-1 rounded-lg border border-[#FDE68A]">
                      <Utensils className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>{item.mealNote}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <section id="itinerary" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-6 pb-6 border-b border-[#EADEF2]">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif-tc font-bold text-[#3A2052] flex items-center justify-center gap-2">
            <span>每日行程</span>
            <MapleLeaf size={22} color="amber" />
          </h2>
          <p className="text-xs sm:text-sm text-[#735D8A] mt-1 font-serif-tc">
            山林 · 美景 · 美食 · 輕奢享受
          </p>
        </div>

      </div>

      <div role="tablist" aria-label="選擇行程日期" className="flex w-fit mx-auto items-center gap-1 p-1 mb-6 bg-[#F4ECF8] rounded-xl border border-[#E5D7EE]">
        {(['d1', 'd2'] as const).map((day, index) => (
          <button
            key={day}
            id={`itinerary-tab-${day}`}
            type="button"
            role="tab"
            aria-selected={activeView === day}
            aria-controls={`itinerary-panel-${day}`}
            tabIndex={activeView === day ? 0 : -1}
            onClick={() => { setActiveView(day); }}
            onKeyDown={(event) => {
              if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
                event.preventDefault();
                const nextDay = event.key === 'Home' ? 'd1' : event.key === 'End' ? 'd2' : day === 'd1' ? 'd2' : 'd1';
                setActiveView(nextDay);

                document.getElementById(`itinerary-tab-${nextDay}`)?.focus();
              }
            }}
            className={`px-8 py-2.5 text-sm font-semibold rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7D6895] ${
              activeView === day
                ? 'bg-white text-[#4A2D62] shadow-2xs'
                : 'text-[#6F5786] hover:text-[#3A2052]'
            }`}
          >
            DAY{index + 1}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl mx-auto">
        {/* DAY 1 COLUMN */}
        {(activeView === 'd1') && (
          <div role="tabpanel" id="itinerary-panel-d1" aria-labelledby="itinerary-tab-d1" className="rounded-3xl bg-gradient-to-b from-[#FAF4FC] via-white to-[#F8F0FA] border border-[#E2D2ED] p-5 sm:p-7 shadow-[0_4px_24px_rgba(90,61,115,0.04)] relative overflow-hidden">
            {/* Top Badge & Day Title from Reference Poster */}
            <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-[#EADEF2]">
              <div className="w-12 h-12 rounded-full bg-[#7D6895] text-white flex flex-col items-center justify-center font-serif-tc shadow-xs shrink-0">
                <span className="text-[9px] uppercase tracking-wider font-sans font-bold leading-none">DAY</span>
                <span className="text-lg font-bold leading-none mt-0.5">1</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-serif-tc font-bold text-[#351D4A]">
                  11/14 (六) 台北→嘉義→奮起湖→阿里山
                </h3>
                <span className="text-xs text-[#7A648F]">
                  首日精選：奮起湖山城老街、鐵道便當、阿里山森林浴與微奢華入住
                </span>
              </div>
              {renderExpandSwitch()}
            </div>

            {/* Day 1 List */}
            {renderTimelineList(day1Items)}

            {/* Bottom Poster Script Note */}
            <div className="mt-6 pt-4 border-t border-[#EADEF2] flex items-center justify-between text-xs text-[#826998]">
              <span className="italic font-serif">Good Times in Alishan</span>
              <MapleLeaf size={14} color="amber" />
            </div>
          </div>
        )}

        {/* DAY 2 COLUMN */}
        {(activeView === 'd2') && (
          <div role="tabpanel" id="itinerary-panel-d2" aria-labelledby="itinerary-tab-d2" className="rounded-3xl bg-gradient-to-b from-[#FAF4FC] via-white to-[#F8F0FA] border border-[#E2D2ED] p-5 sm:p-7 shadow-[0_4px_24px_rgba(90,61,115,0.04)] relative overflow-hidden">
            {/* Top Badge & Day Title from Reference Poster */}
            <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-[#EADEF2]">
              <div className="w-12 h-12 rounded-full bg-[#7D6895] text-white flex flex-col items-center justify-center font-serif-tc shadow-xs shrink-0">
                <span className="text-[9px] uppercase tracking-wider font-sans font-bold leading-none">DAY</span>
                <span className="text-lg font-bold leading-none mt-0.5">2</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-serif-tc font-bold text-[#351D4A]">
                  11/15 (日) 阿里山 → 玉山觀日 → 達娜伊谷 → 故宮南院 → 台北
                </h3>
                <span className="text-xs text-[#7A648F]">
                  次日精選：玉山浩瀚日出、鄒族風味饗宴、國立故宮南院水墨藝術
                </span>
              </div>
              {renderExpandSwitch()}
            </div>

            {/* Day 2 List */}
            {renderTimelineList(day2Items)}

            {/* Bottom Poster Script Note */}
            <div className="mt-6 pt-4 border-t border-[#EADEF2] flex items-center justify-between text-xs text-[#826998]">
              <span className="font-serif-tc">與美好的風景相遇在秋天</span>
              <StarFivePoint size={13} color="#D97706" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
