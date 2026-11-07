import React, { useEffect, useRef, useState } from 'react';
import { Compass, CalendarDays, Map, Phone } from 'lucide-react';
import { CompanyLogo } from './MapleLeafStars';

const sectionLinks = [
  { id: 'overview', label: '活動總覽', Icon: Compass },
  { id: 'itinerary', label: '每日行程', Icon: CalendarDays },
  { id: 'info', label: '旅遊資訊', Icon: Map },
  { id: 'contact', label: '緊急聯絡', Icon: Phone },
];

export const Header: React.FC = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 16);
      const marker = (headerRef.current?.getBoundingClientRect().height ?? 116) + 64;
      let current = 'overview';
      for (const section of sectionLinks) {
        if ((document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity) <= marker) current = section.id;
      }
      if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8) current = 'contact';
      setActiveSection(current);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <header ref={headerRef} className={`site-glass-header sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300 ${scrolled ? 'is-scrolled border-[#DCCDE7]/60 shadow-[0_6px_28px_rgba(70,40,90,0.06)]' : 'border-white/40'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-6">
          <a href="#overview" className="flex items-center gap-2 min-h-16 min-w-0 rounded-lg focus-visible:outline-2 focus-visible:outline-[#7D6895]">
            <span className="shrink-0"><CompanyLogo /></span>
            <span className="text-sm sm:text-lg font-serif-tc font-bold text-[#3A224E]">秋季阿里山微奢華兩日遊</span>
          </a>
          <nav aria-label="頁面區塊快捷連結" className="grid grid-cols-4 gap-1 md:gap-3 pb-1 md:pb-0">
            {sectionLinks.map(({id,label,Icon}) => {
              const active = activeSection === id;
              return (
                <a key={id} href={`#${id}`} aria-current={active ? 'location' : undefined} className={`section-nav-link relative flex min-h-12 items-center justify-center gap-1.5 whitespace-nowrap px-1.5 md:px-3 text-xs sm:text-sm rounded-lg focus-visible:outline-2 focus-visible:outline-[#7D6895] ${active ? 'text-[#4B2D62] font-bold' : 'text-[#7B6589] font-medium hover:text-[#4B2D62]'}`}>
                  <Icon aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 transition-colors ${active ? 'text-[#AD854B]' : 'text-[#9C85AC]'}`} strokeWidth={active ? 2 : 1.6} />
                  <span>{label}</span>
                  <span aria-hidden="true" className={`nav-gold-line absolute bottom-1 left-3 right-3 h-[2px] rounded-full transition-[opacity,transform] duration-300 ${active ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'}`} />
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
