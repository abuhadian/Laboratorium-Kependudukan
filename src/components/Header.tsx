import React from 'react';
import { Activity, Play, Pause, RefreshCw, Sparkles, MapPin, Award, Compass, Building2, BookOpen, Users } from 'lucide-react';

interface HeaderProps {
  activeTab: 'demographics' | 'map' | 'predictive' | 'aspirations' | 'simulator' | 'sectors' | 'guestbook';
  setActiveTab: (tab: 'demographics' | 'map' | 'predictive' | 'aspirations' | 'simulator' | 'sectors' | 'guestbook') => void;
  isSimulating: boolean;
  setIsSimulating: (val: boolean) => void;
  simulatedPopulation: number;
  simSpeed: number;
  setSimSpeed: (speed: number) => void;
  resetSimulation: () => void;
  todayVisitorsCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isSimulating,
  setIsSimulating,
  simulatedPopulation,
  simSpeed,
  setSimSpeed,
  resetSimulation,
  todayVisitorsCount = 362,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Banner with Regency branding & real-time indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/30 flex-shrink-0">
            <span className="font-bold text-white text-lg tracking-wider">BR</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Laboratorium Kependudukan Berau
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Kab. Berau • Kaltim
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Sistem Pemantauan Demografi Real-Time & Analitik Prediktif Peluang Lulusan Baru di Sektor Industri Strategis
            </p>
          </div>
        </div>

        {/* Real-time Telemetry, Visitor Counter & Simulation Controller */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3 bg-slate-950/70 px-3 py-1.5 rounded-lg border border-slate-800/80 text-xs">
          {/* Live Visitor Counter Indicator */}
          <button
            onClick={() => setActiveTab('guestbook')}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-emerald-300 transition"
            title="Klik untuk membuka Buku Tamu & Statistik Pengunjung"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 hidden sm:inline">Pengunjung Hari Ini:</span>
            <span className="font-mono font-bold text-emerald-400">{todayVisitorsCount.toLocaleString('id-ID')}</span>
          </button>

          <div className="flex items-center gap-2 pr-2 border-r border-slate-800">
            <span className="relative flex h-2.5 w-2.5">
              {isSimulating && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSimulating ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="text-slate-300 font-medium hidden sm:inline">
              {isSimulating ? 'Live Telemetry' : 'Paused'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">Estimasi Jiwa:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              {simulatedPopulation.toLocaleString('id-ID')}
            </span>
          </div>

          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`p-1.5 rounded transition ${
                isSimulating ? 'bg-slate-800 hover:bg-slate-700 text-amber-300' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title={isSimulating ? 'Jeda Simulasi' : 'Jalankan Simulasi'}
            >
              {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 5 : 1)}
              className="px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]"
              title="Ubah Kecepatan Simulasi"
            >
              {simSpeed}x
            </button>
            <button
              onClick={resetSimulation}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Reset ke Data BPS 2024"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 no-scrollbar text-xs sm:text-sm font-medium">
          <button
            onClick={() => setActiveTab('demographics')}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'demographics'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Dashboard Demografi</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Peta Spasial 13 Kecamatan</span>
          </button>

          <button
            onClick={() => setActiveTab('predictive')}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'predictive'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Analitik Prediktif Pasar Kerja</span>
          </button>

          <button
            onClick={() => setActiveTab('aspirations')}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'aspirations'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>Cita-cita (Profesi) Siswa</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'simulator'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Simulator Peluang Lulusan Baru & AI</span>
          </button>

          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'sectors'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>7 Sektor Industri Strategis</span>
          </button>

          <button
            onClick={() => setActiveTab('guestbook')}
            className={`px-3 py-2 rounded-md whitespace-nowrap transition flex items-center gap-2 ${
              activeTab === 'guestbook'
                ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Buku Tamu &amp; Pengunjung</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

