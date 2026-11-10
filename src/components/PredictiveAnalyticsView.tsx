import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Sliders,
  Sparkles,
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { FIVE_YEAR_PROJECTIONS, STRATEGIC_SECTORS } from '../data/strategicSectors';

export const PredictiveAnalyticsView: React.FC = () => {
  // Simulator Parameters
  const [iknMultiplier, setIknMultiplier] = useState(1.15); // 1.0 to 1.6
  const [automationLevel, setAutomationLevel] = useState(1.0); // 0.8 to 1.3
  const [localQuotaTarget, setLocalQuotaTarget] = useState(70); // 50 to 90%
  const [greenTransition, setGreenTransition] = useState(1.1);

  const [simulatedData, setSimulatedData] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2025);

  // Recalculate projections dynamically based on interactive sliders
  useEffect(() => {
    const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const data = years.map((yr, idx) => {
      const baseGrads = Math.round(6550 * Math.pow(1.036, idx));

      // Mining: base growth moderated by automation
      const mining = Math.round(2150 * Math.pow(1.032, idx) * (1 / (0.75 + 0.25 * automationLevel)));

      // Agriculture: steady hilirisasi
      const agriculture = Math.round(1480 * Math.pow(1.048, idx));

      // Tourism: strongly accelerated by IKN proximity and global campaigns
      const tourism = Math.round(920 * Math.pow(1.13, idx) * iknMultiplier);

      // Logistics: driven by port Tanjung Redeb/Tanjung Batu and IKN corridor
      const logistics = Math.round(620 * Math.pow(1.10, idx) * iknMultiplier);

      // Fisheries:
      const fisheries = Math.round(650 * Math.pow(1.055, idx));

      // Carbon & Forestry:
      const forestry = Math.round(350 * Math.pow(1.12, idx) * greenTransition);

      // Digital & Services:
      const digital = Math.round(750 * Math.pow(1.085, idx));

      const totalDemand = mining + agriculture + tourism + logistics + fisheries + forestry + digital;
      const localGuaranteed = Math.round(totalDemand * (localQuotaTarget / 100));
      const absorptionRatio = Math.min(100, Math.round((localGuaranteed / baseGrads) * 100));

      return {
        year: yr,
        graduatesSupply: baseGrads,
        totalJobDemand: totalDemand,
        localGuaranteedAbsorption: localGuaranteed,
        absorptionRatio,
        sectors: {
          mining,
          agriculture,
          tourism,
          logistics,
          fisheries,
          forestry,
          digital,
        },
      };
    });

    setSimulatedData(data);
  }, [iknMultiplier, automationLevel, localQuotaTarget, greenTransition]);

  const activeYearData = simulatedData.find((d) => d.year === selectedYear) || simulatedData[1] || {
    year: 2025,
    graduatesSupply: 6850,
    totalJobDemand: 6600,
    localGuaranteedAbsorption: 4620,
    absorptionRatio: 67,
    sectors: { mining: 2200, agriculture: 1550, tourism: 1100, logistics: 720, fisheries: 690, forestry: 410, digital: 810 },
  };

  // Skill Gap matrix for fresh graduates in Berau
  const skillGaps = [
    {
      sector: 'Pertambangan & Energi',
      status: 'Defisit Tenaga Ahli Lokal',
      highDemandRoles: ['Mekanik Alat Berat', 'POP K3 Tambang', 'Mine Reclamation Engineer'],
      gapScore: 82, // 1-100 severity of gap
      remedy: 'Peningkatan sertifikasi BNSP & BLK Disnakertrans Berau',
    },
    {
      sector: 'Ekowisata Bahari (Derawan-Maratua)',
      status: 'Peluang Ekspansi Masif',
      highDemandRoles: ['Pemandu Selam Berlisensi PADI', 'Hospitality Manager Bahasa Asing', 'Marine Biologist'],
      gapScore: 78,
      remedy: 'Pelatihan bahasa asing intensif & kurikulum vokasi perhotelan',
    },
    {
      sector: 'Perkebunan Sawit & Hilirisasi',
      status: 'Stabil Berkelanjutan',
      highDemandRoles: ['Quality Control Pabrik CPO', 'Teknisi Mekanisasi Kebun', 'Auditor ISPO/RSPO'],
      gapScore: 64,
      remedy: 'Kemitraan magang SMK Pertanian dengan PKS di Segah/Biatan',
    },
    {
      sector: 'Logistik Maritim & Penyangga IKN',
      status: 'Pertumbuhan Tertinggi',
      highDemandRoles: ['Supply Chain Coordinator', 'Operator Terminal Petikemas', 'Teknik Sipil Pelabuhan'],
      gapScore: 88,
      remedy: 'Penyelarasan program D3/D4 Logistik Maritim Poltek Berau',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <TrendingUp className="w-3.5 h-3.5" />
              Model Prediktif Kebutuhan Tenaga Kerja 2024–2030
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Analitik Peluang Kerja Lulusan Baru di Sektor Strategis Berau
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Memproyeksikan penyerapan angkatan kerja muda (SMK, Diploma, Sarjana) berdasarkan siklus investasi hilirisasi tambang batubara, perkebunan kelapa sawit, ekowisata bahari kepulauan, dan koridor logistik penyangga IKN Nusantara.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Simulation Control Box */}
      <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">
              Simulator Skenario Kebijakan Daerah & Perekonomian
            </h3>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
            Kalkulasi Real-time Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* IKN Multiplier */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Pengaruh Koridor IKN</span>
              <span className="font-mono font-bold text-indigo-400">{iknMultiplier}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.6"
              step="0.05"
              value={iknMultiplier}
              onChange={(e) => setIknMultiplier(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400">
              Mendorong penyerapan logistik laut di Mantaritip & wisata Derawan
            </div>
          </div>

          {/* Automation Level */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Adopsi Otomasi Tambang</span>
              <span className="font-mono font-bold text-amber-400">{automationLevel}x</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.4"
              step="0.05"
              value={automationLevel}
              onChange={(e) => setAutomationLevel(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400">
              Otomasi tinggi menuntut keahlian teknis & mekatronika lebih spesifik
            </div>
          </div>

          {/* Local Quota Target */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Kuota Naker Lokal (Perda)</span>
              <span className="font-mono font-bold text-emerald-400">{localQuotaTarget}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="90"
              step="5"
              value={localQuotaTarget}
              onChange={(e) => setLocalQuotaTarget(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400">
              Target kepatuhan Perda No. 8/2018 (min. 70% tenaga lokal)
            </div>
          </div>

          {/* Green Transition */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-medium">Ekonomi Hijau & Karbon</span>
              <span className="font-mono font-bold text-teal-400">{greenTransition}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="1.5"
              step="0.05"
              value={greenTransition}
              onChange={(e) => setGreenTransition(parseFloat(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="text-[10px] text-slate-400">
              Proyek restorasi hutan Wehea, mangrove, dan kredit karbon
            </div>
          </div>
        </div>
      </div>

      {/* Projections Trajectory Table & Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 5-Year Trajectory Table */}
        <div className="lg:col-span-7 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              Proyeksi Pasokan vs Penyerapan Kerja Lulusan Baru (2024–2030)
            </h3>
            <span className="text-[11px] text-slate-400">Klik tahun untuk rincian</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Tahun</th>
                  <th className="py-2.5 px-3">Lulusan Baru (Supply)</th>
                  <th className="py-2.5 px-3">Kebutuhan Formasi (Demand)</th>
                  <th className="py-2.5 px-3">Penyerapan Naker Lokal</th>
                  <th className="py-2.5 px-3">Rasio Serapan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {simulatedData.map((row) => (
                  <tr
                    key={row.year}
                    onClick={() => setSelectedYear(row.year)}
                    className={`cursor-pointer transition ${
                      selectedYear === row.year
                        ? 'bg-emerald-950/40 font-semibold text-white'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 flex items-center gap-2 font-mono">
                      {selectedYear === row.year && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      )}
                      <span>{row.year}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-amber-400">
                      {row.graduatesSupply.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400">
                      {row.totalJobDemand.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                      {row.localGuaranteedAbsorption.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.absorptionRatio >= 75
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {row.absorptionRatio}% Terakomodir
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Insight Dinamis:</span> Pada tahun {selectedYear}, diperkirakan terbentuk{' '}
              <span className="text-emerald-400 font-mono font-bold">
                {activeYearData.totalJobDemand.toLocaleString('id-ID')} formasi kerja
              </span>{' '}
              di 7 sektor strategis Berau, dengan target serapan tenaga kerja lokal sebesar{' '}
              <span className="text-cyan-400 font-mono font-bold">
                {activeYearData.localGuaranteedAbsorption.toLocaleString('id-ID')} orang
              </span>.
            </div>
          </div>
        </div>

        {/* Right: Sectoral Breakdown for Selected Year */}
        <div className="lg:col-span-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Rincian Kebutuhan Sektor
                </span>
                <h4 className="text-base font-bold text-white">
                  Tahun Proyeksi: <span className="text-emerald-400 font-mono">{selectedYear}</span>
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Formasi</span>
                <div className="text-lg font-bold font-mono text-cyan-400">
                  {activeYearData.totalJobDemand.toLocaleString('id-ID')}
                </div>
              </div>
            </div>

            {/* Sektor Progress Bars */}
            <div className="space-y-3">
              {[
                { label: 'Pertambangan Batubara & Alat Berat', val: activeYearData.sectors.mining, color: 'bg-orange-500' },
                { label: 'Kelapa Sawit & Hilirisasi CPO', val: activeYearData.sectors.agriculture, color: 'bg-lime-500' },
                { label: 'Ekowisata Bahari & Hospitaliti', val: activeYearData.sectors.tourism, color: 'bg-cyan-500' },
                { label: 'Logistik Maritim & Pelabuhan IKN', val: activeYearData.sectors.logistics, color: 'bg-indigo-500' },
                { label: 'Jasa Digital, Medis & Perkotaan', val: activeYearData.sectors.digital, color: 'bg-emerald-500' },
                { label: 'Kelautan & Perikanan Tangkap', val: activeYearData.sectors.fisheries, color: 'bg-sky-500' },
                { label: 'Kehutanan Lestari & Karbon Biru', val: activeYearData.sectors.forestry, color: 'bg-teal-500' },
              ].map((item, idx) => {
                const pct = Math.round((item.val / activeYearData.totalJobDemand) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[220px]">
                        {item.label}
                      </span>
                      <span className="font-mono text-slate-300">
                        {item.val.toLocaleString('id-ID')} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
            *Data simulasi disintesis dari rencana investasi Bappeda Berau & tren ekspansi hilirisasi.
          </div>
        </div>
      </div>

      {/* Skill Gap & Mismatch Identification Matrix */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Matriks Kesenjangan Keterampilan Lulusan Baru (Skill Gap Analysis)
            </h3>
            <p className="text-xs text-slate-400">
              Mengidentifikasi diskoneksi antara kompetensi lulusan lokal dan standar industri yang dipersyaratkan perusahaan di Berau.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillGaps.map((sg, i) => (
            <div
              key={i}
              className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-emerald-400">{sg.sector}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Gap {sg.gapScore}%
                  </span>
                </div>
                <div className="text-xs font-semibold text-white mb-2">{sg.status}</div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-400 text-[11px]">Posisi Paling Dicari:</div>
                  <ul className="space-y-0.5 text-slate-300 text-[11px]">
                    {sg.highDemandRoles.map((role, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span className="truncate">{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                <span className="text-emerald-400 font-semibold">Rekomendasi Vokasi:</span> {sg.remedy}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
