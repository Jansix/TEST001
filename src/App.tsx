/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DynamicDashboard } from './components/DynamicDashboard';
import { WeatherWidget } from './components/WeatherWidget';
import { DailyItinerary } from './components/DailyItinerary';
import { TravelInfo } from './components/TravelInfo';
import { EmergencyContacts } from './components/EmergencyContacts';
import { Footer } from './components/Footer';

export default function App() {
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
    </div>
  );
}
