import React from 'react';
import { CompanyLogo } from './MapleLeafStars';

const sectionLinks = [
  { id: 'overview', label: '活動總覽' },
  { id: 'itinerary', label: '每日行程' },
  { id: 'info', label: '旅遊資訊' },
  { id: 'contact', label: '緊急聯絡' },
];

export const Header: React.FC = () => (
  <header className="sticky top-0 z-50 bg-[#FCFAFD]/95 backdrop-blur-md border-b border-[#EADEF2] shadow-[0_2px_12px_rgba(90,61,115,0.03)]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <a href="#overview" className="flex items-center gap-2 min-h-16 min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-[#7D6895]">
          <span className="shrink-0"><CompanyLogo /></span>
          <span className="text-sm sm:text-lg font-serif-tc font-bold text-[#3A224E]">秋季阿里山微奢華兩日遊</span>
        </a>
        <nav aria-label="頁面區塊快捷連結" className="grid grid-cols-4 gap-1 pb-2 md:pb-0 md:gap-2">
          {sectionLinks.map((section) => (
            <a key={section.id} href={`#${section.id}`} className="flex min-h-11 items-center justify-center whitespace-nowrap rounded-xl px-2 md:px-4 text-xs sm:text-sm font-semibold text-[#553B70] bg-[#F4ECF8] hover:bg-[#E9DCEF] focus-visible:outline-2 focus-visible:outline-[#7D6895] transition-colors">
              {section.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  </header>
);
