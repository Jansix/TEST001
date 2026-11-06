/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DynamicDashboard } from './components/DynamicDashboard';
import { WeatherWidget } from './components/WeatherWidget';
import { DailyItinerary } from './components/DailyItinerary';
import { TravelInfo } from './components/TravelInfo';
import { EmergencyContacts } from './components/EmergencyContacts';
import { Footer } from './components/Footer';

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  useEffect(() => {
    const updateScroll = () => setShowBackToTop(window.scrollY > 400);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  useEffect(() => {
    const arrivalWindow = window as Window & {
      __arrivalStarted?: number;
      __dismissArrival?: () => void;
    };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elapsed = performance.now() - (arrivalWindow.__arrivalStarted ?? 0);
    const timer = window.setTimeout(() => {
      arrivalWindow.__dismissArrival?.();
    }, reducedMotion ? 0 : Math.max(0, 1000 - elapsed));
    return () => window.clearTimeout(timer);
  }, []);

  const scrollToItinerary = () => {
    window.location.hash = 'itinerary';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FAF6FC] via-[#FDFBFD] to-[#FAF5FA] text-[#2D1F3B] selection:bg-[#EADEF2] selection:text-[#3B2052]">
      <Header />

      <main className="flex-1">
        <div id="overview">
          <Hero />
          <DynamicDashboard onSwitchToItinerary={scrollToItinerary} />
          <WeatherWidget />
        </div>
        <DailyItinerary />
        <TravelInfo />
        <EmergencyContacts />
      </main>

      {/* 頁尾 */}
      <Footer />
      {showBackToTop && (
        <button
          type="button"
          aria-label="回到頂端"
          onClick={() => {
            window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
            window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
          }}
          className="fixed right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#6E4B8B] text-white shadow-lg border border-white/30 hover:bg-[#553870] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#7D6895]"
          style={{ bottom: 'calc(20px + env(safe-area-inset-bottom, 0px))' }}
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
