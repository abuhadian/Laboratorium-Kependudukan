/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LiveDemographicTicker } from './components/LiveDemographicTicker';
import { DemographicOverview } from './components/DemographicOverview';
import { InteractiveMap } from './components/InteractiveMap';
import { PredictiveAnalyticsView } from './components/PredictiveAnalyticsView';
import { CareerSimulatorView } from './components/CareerSimulatorView';
import { StrategicSectorsView } from './components/StrategicSectorsView';
import { StudentAspirationsView } from './components/StudentAspirationsView';
import { GuestbookView } from './components/GuestbookView';
import { DistrictDetailModal } from './components/DistrictDetailModal';
import { BERAU_TOTAL_STATS, KECAMATAN_LIST } from './data/berauDemographics';
import { INITIAL_VISITOR_ANALYTICS } from './data/guestbookData';
import { DemographicEvent, KecamatanData } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'demographics' | 'map' | 'predictive' | 'aspirations' | 'simulator' | 'sectors' | 'guestbook'>('demographics');
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [simulatedPopulation, setSimulatedPopulation] = useState(BERAU_TOTAL_STATS.totalPopulation);
  const [todayVisitorsCount, setTodayVisitorsCount] = useState(INITIAL_VISITOR_ANALYTICS.todayCount);
  const [selectedKecamatan, setSelectedKecamatan] = useState<KecamatanData | null>(KECAMATAN_LIST[0]);
  const [modalKecamatan, setModalKecamatan] = useState<KecamatanData | null>(null);

  // Record visitor visit on application load
  useEffect(() => {
    const recordVisit = async () => {
      try {
        const res = await fetch('/api/visitors/record', { method: 'POST' });
        const data = await res.json();
        if (data.success && typeof data.todayCount === 'number') {
          setTodayVisitorsCount(data.todayCount);
        }
      } catch (err) {
        console.warn('Could not record visitor count to backend:', err);
      }
    };
    recordVisit();
  }, []);

  // Initial event log
  const [events, setEvents] = useState<DemographicEvent[]>([
    {
      id: 'e-1',
      timestamp: 'Baru saja',
      type: 'birth',
      kecamatan: 'Tanjung Redeb',
      description: 'Kelahiran baru tercatat di RSUD dr. Abdul Rivai Tanjung Redeb',
      impact: 1,
    },
    {
      id: 'e-2',
      timestamp: '2m lalu',
      type: 'job_hired',
      kecamatan: 'Gunung Tabur',
      description: '14 Lulusan SMK Teknik diterima magang operasional di PT Berau Coal Site Lati',
      impact: 0,
    },
    {
      id: 'e-3',
      timestamp: '5m lalu',
      type: 'in_migration',
      kecamatan: 'Segah',
      description: 'Registrasi 6 tenaga ahli agronomi perkebunan kelapa sawit masuk',
      impact: 6,
    },
    {
      id: 'e-4',
      timestamp: '12m lalu',
      type: 'graduation',
      kecamatan: 'Pulau Derawan',
      description: '18 Pemuda lokal menyelesaikan sertifikasi Pemandu Wisata Bahari & PADI Open Water',
      impact: 0,
    },
  ]);

  // Real-time Demographic Simulation Ticker Loop
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(1000, Math.floor(4000 / simSpeed));

    const possibleEvents = [
      {
        type: 'birth' as const,
        templates: [
          'Kelahiran bayi sehat di Puskesmas Sambaliung',
          'Pencatatan akta kelahiran baru di Disdukcapil Berau',
          'Kelahiran baru di wilayah pedalaman Kecamatan Kelay',
          'Kelahiran anak pertama di kawasan pesisir Talisayan',
        ],
        impact: 1,
      },
      {
        type: 'in_migration' as const,
        templates: [
          'Kedatangan tenaga terampil perkapalan di Pelabuhan Tanjung Batu',
          'Pekerja spesialis alat berat tiba di mess Gunung Tabur',
          'Keluarga baru pindah domisili ke perumahan Tanjung Redeb',
          'Staf perhotelan resort internasional tiba di Maratua',
        ],
        impact: 2,
      },
      {
        type: 'job_hired' as const,
        templates: [
          '8 Lulusan D3 Poltek diterima di pabrik kelapa sawit CPO Segah',
          '12 Lulusan SMA/SMK lokal direkrut divisi keselamatan kerja tambang',
          'Kelompok pemuda lulusan baru mandiri merintis homestay ekowisata Labuan Cermin',
          'Penerimaan 5 perawat baru di klinik kesehatan operasional pedalaman',
        ],
        impact: 0,
      },
      {
        type: 'graduation' as const,
        templates: [
          'Pelepasan 64 siswa kejuruan teknik alat berat SMKN 1 Berau',
          'Wisuda 45 sarjana baru STIE Muhammadiyah Tanjung Redeb',
          'Pelatihan vokasi barista & hospitality pesisir Biduk-Biduk tuntas',
        ],
        impact: 0,
      },
      {
        type: 'out_migration' as const,
        templates: [
          'Mahasiswa Berau berangkat studi lanjut ke Samarinda/Yogyakarta',
          'Pekerja rotasi tambang menyelesaikan kontrak kerja',
        ],
        impact: -1,
      },
    ];

    const interval = setInterval(() => {
      const randomEventDef = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
      const randomKecamatan = KECAMATAN_LIST[Math.floor(Math.random() * KECAMATAN_LIST.length)];
      const randomDesc = randomEventDef.templates[Math.floor(Math.random() * randomEventDef.templates.length)];

      const now = new Date();
      const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const newEvent: DemographicEvent = {
        id: `evt-${Date.now()}`,
        timestamp: timeString,
        type: randomEventDef.type,
        kecamatan: randomKecamatan.name,
        description: randomDesc,
        impact: randomEventDef.impact,
      };

      setSimulatedPopulation((prev) => prev + randomEventDef.impact);
      setEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed]);

  const resetSimulation = () => {
    setSimulatedPopulation(BERAU_TOTAL_STATS.totalPopulation);
    setSimSpeed(1);
  };

  const handleSelectKecamatan = (k: KecamatanData) => {
    setSelectedKecamatan(k);
    setModalKecamatan(k);
  };

  const handleSimulateCareerFromKecamatan = (_kecamatanName: string) => {
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSimulating={isSimulating}
        setIsSimulating={setIsSimulating}
        simulatedPopulation={simulatedPopulation}
        simSpeed={simSpeed}
        setSimSpeed={setSimSpeed}
        resetSimulation={resetSimulation}
        todayVisitorsCount={todayVisitorsCount}
      />

      {/* Real-time Ticker Feed */}
      <LiveDemographicTicker events={events} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'demographics' && (
          <DemographicOverview
            simulatedPopulation={simulatedPopulation}
            onSelectKecamatan={handleSelectKecamatan}
            onSwitchToMap={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            onSelectKecamatan={(k) => {
              setSelectedKecamatan(k);
            }}
            selectedKecamatan={selectedKecamatan}
          />
        )}

        {activeTab === 'predictive' && (
          <PredictiveAnalyticsView />
        )}

        {activeTab === 'aspirations' && (
          <StudentAspirationsView />
        )}

        {activeTab === 'simulator' && (
          <CareerSimulatorView />
        )}

        {activeTab === 'sectors' && (
          <StrategicSectorsView />
        )}

        {activeTab === 'guestbook' && (
          <GuestbookView />
        )}
      </main>

      {/* District Detail Modal */}
      {modalKecamatan && (
        <DistrictDetailModal
          kecamatan={modalKecamatan}
          onClose={() => setModalKecamatan(null)}
          onSimulateCareer={handleSimulateCareerFromKecamatan}
        />
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-400">
              Laboratorium Kependudukan & Ketenagakerjaan Kabupaten Berau
            </span>
            <span>• Bumi Batiwakkal, Kalimantan Timur</span>
          </div>
          <div className="text-slate-500 text-center sm:text-right">
            <span>Sinergi Data Disdukcapil, Disnakertrans & Bappeda Kab. Berau | Sensus Penduduk & Proyeksi Ketenagakerjaan 2024–2030</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
