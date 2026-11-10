import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building,
  GraduationCap,
  Users,
  Briefcase,
  ChevronRight,
  Maximize2,
  Info,
} from 'lucide-react';
import { KECAMATAN_LIST } from '../data/berauDemographics';
import { KecamatanData, MapViewLayer } from '../types';

interface InteractiveMapProps {
  onSelectKecamatan: (k: KecamatanData) => void;
  selectedKecamatan: KecamatanData | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectKecamatan,
  selectedKecamatan,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapViewLayer>('absorption');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredKecamatan, setHoveredKecamatan] = useState<KecamatanData | null>(null);

  // Strategic industrial hotspots with coordinates mapped onto the SVG coordinate space (900x750)
  const hotspots = [
    { name: 'PT Berau Coal Site Lati', sector: 'mining', x: 470, y: 240, desc: 'Pusat Tambang Batubara Terbesar' },
    { name: 'PT Berau Coal Site Binungan', sector: 'mining', x: 530, y: 340, desc: 'Tambang Batubara & Workshop' },
    { name: 'PT Mulia Inti Perkasa (MIP)', sector: 'mining', x: 320, y: 180, desc: 'Tambang Batubara & Operasi Segah' },
    { name: 'PKS Segah Agro', sector: 'agriculture', x: 300, y: 220, desc: 'Pabrik Minyak Kelapa Sawit CPO' },
    { name: 'Hutan Lindung Dayak Wehea', sector: 'forestry', x: 220, y: 370, desc: 'Pusat Konservasi Hutan & Karbon' },
    { name: 'Pelabuhan Mantaritip', sector: 'logistics', x: 500, y: 380, desc: 'Kawasan Industri & Pelabuhan Laut' },
    { name: 'Kepulauan Derawan Diving', sector: 'tourism', x: 670, y: 220, desc: 'Pusat Diving & Penyu Hijau' },
    { name: 'Resor Mewah Maratua & Kakaban', sector: 'tourism', x: 790, y: 280, desc: 'Eco-Resort & Danau Ubur-Ubur' },
    { name: 'PPI & Wisata Hiu Paus Talisayan', sector: 'fisheries', x: 660, y: 550, desc: 'Pangkalan Ikan & Whale Shark' },
    { name: 'Danau Dua Rasa Labuan Cermin', sector: 'tourism', x: 770, y: 670, desc: 'Ekowisata Danau Air Tawar-Asin' },
  ];

  // Helper color calculation for choropleth layers
  const getFillColor = (k: KecamatanData) => {
    const isSelected = selectedKecamatan?.id === k.id;
    const isHovered = hoveredKecamatan?.id === k.id;

    if (activeLayer === 'density') {
      // Density scale
      if (k.density > 500) return isHovered ? '#10b981' : isSelected ? '#059669' : '#047857';
      if (k.density > 50) return isHovered ? '#0ea5e9' : isSelected ? '#0284c7' : '#0369a1';
      if (k.density > 15) return isHovered ? '#6366f1' : isSelected ? '#4f46e5' : '#3730a3';
      return isHovered ? '#475569' : isSelected ? '#334155' : '#1e293b';
    }

    if (activeLayer === 'fresh_grads') {
      // Fresh grad cohort count
      const count = k.freshGraduatesPerYear.total;
      if (count > 2000) return isHovered ? '#f59e0b' : isSelected ? '#d97706' : '#b45309';
      if (count > 600) return isHovered ? '#fbbf24' : isSelected ? '#f59e0b' : '#92400e';
      if (count > 200) return isHovered ? '#38bdf8' : isSelected ? '#0284c7' : '#075985';
      return isHovered ? '#475569' : isSelected ? '#334155' : '#1e293b';
    }

    if (activeLayer === 'absorption') {
      // Labor absorption index (70-100)
      const score = k.laborAbsorptionIndex;
      if (score >= 88) return isHovered ? '#10b981' : isSelected ? '#059669' : '#047857'; // highest
      if (score >= 82) return isHovered ? '#14b8a6' : isSelected ? '#0d9488' : '#0f766e';
      if (score >= 77) return isHovered ? '#0ea5e9' : isSelected ? '#0284c7' : '#0369a1';
      return isHovered ? '#64748b' : isSelected ? '#475569' : '#334155';
    }

    // Default or tourism
    if (k.primaryIndustries.some((i) => i.toLowerCase().includes('wisata') || i.toLowerCase().includes('resort'))) {
      return isHovered ? '#06b6d4' : isSelected ? '#0891b2' : '#0e7490';
    }
    if (k.primaryIndustries.some((i) => i.toLowerCase().includes('tambang'))) {
      return isHovered ? '#f97316' : isSelected ? '#ea580c' : '#c2410c';
    }
    return isHovered ? '#475569' : isSelected ? '#334155' : '#1e293b';
  };

  return (
    <div className="space-y-4">
      {/* Layer selector & controls bar */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300">Layer Visualisasi:</span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveLayer('absorption')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeLayer === 'absorption'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              💼 Peluang Kerja Lulusan
            </button>
            <button
              onClick={() => setActiveLayer('fresh_grads')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeLayer === 'fresh_grads'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🎓 Sebaran Lulusan Baru
            </button>
            <button
              onClick={() => setActiveLayer('density')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeLayer === 'density'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              👥 Kepadatan Penduduk
            </button>
            <button
              onClick={() => setActiveLayer('tourism')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                activeLayer === 'tourism'
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏭 Koridor Industri & Wisata
            </button>
          </div>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 px-1">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-white ml-1 border-l border-slate-800 pl-1.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area with Sidebar Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* SVG Interactive Map */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden shadow-2xl min-h-[520px] flex flex-col">
          {/* Map Title & Compass */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none">
            <div className="bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-md">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Peta Wilayah Kabupaten Berau (13 Kecamatan)
              </div>
              <div className="text-[10px] text-slate-400">
                Klik wilayah kecamatan untuk melihat profil tenaga kerja
              </div>
            </div>
          </div>

          {/* Compass Rose */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold text-slate-300">
              <span className="text-emerald-400">U</span>
            </div>
          </div>

          {/* SVG Container */}
          <div className="flex-1 flex items-center justify-center overflow-auto">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: 'transform 0.25s ease-out',
              }}
              className="w-full max-w-[850px] aspect-[850/650]"
            >
              <svg
                viewBox="100 100 780 640"
                className="w-full h-full drop-shadow-2xl select-none"
              >
                {/* Background water representing Sulawesi Sea & Makassar Strait */}
                <defs>
                  <pattern id="seaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
                  </pattern>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                <rect x="0" y="0" width="1000" height="800" fill="#090d16" />
                <rect x="0" y="0" width="1000" height="800" fill="url(#seaGrid)" />

                {/* Ocean labels */}
                <text x="740" y="170" fill="#334155" fontSize="13" fontStyle="italic" fontWeight="600">
                  Laut Sulawesi
                </text>
                <text x="760" y="520" fill="#334155" fontSize="13" fontStyle="italic" fontWeight="600">
                  Selat Makassar
                </text>
                <text x="140" y="160" fill="#1e293b" fontSize="11" fontWeight="600">
                  Prov. Kalimantan Utara (Bulungan / Malinau)
                </text>
                <text x="150" y="530" fill="#1e293b" fontSize="11" fontWeight="600">
                  Kab. Kutai Timur (Koridor IKN)
                </text>

                {/* Kecamatan Polygons */}
                {KECAMATAN_LIST.map((k) => {
                  const isSelected = selectedKecamatan?.id === k.id;
                  const isHovered = hoveredKecamatan?.id === k.id;
                  const fillColor = getFillColor(k);

                  return (
                    <g key={k.id} className="cursor-pointer">
                      <path
                        d={k.svgPath}
                        fill={fillColor}
                        stroke={isSelected ? '#34d399' : isHovered ? '#6ee7b7' : '#0f172a'}
                        strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 1.5}
                        filter={isSelected ? 'url(#glow)' : undefined}
                        onClick={() => onSelectKecamatan(k)}
                        onMouseEnter={() => setHoveredKecamatan(k)}
                        onMouseLeave={() => setHoveredKecamatan(null)}
                        className="transition-colors duration-200"
                      />

                      {/* Text Label */}
                      <text
                        x={k.labelPos.x}
                        y={k.labelPos.y}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : '#f1f5f9'}
                        fontSize={k.id === 'tanjung_redeb' ? '11' : '10'}
                        fontWeight={isSelected ? 'bold' : '600'}
                        className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                      >
                        {k.name}
                      </text>

                      {/* Small Indicator on Label */}
                      <text
                        x={k.labelPos.x}
                        y={k.labelPos.y + 11}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8"
                        fontFamily="monospace"
                        className="pointer-events-none drop-shadow"
                      >
                        {activeLayer === 'absorption'
                          ? `Index: ${k.laborAbsorptionIndex}`
                          : activeLayer === 'fresh_grads'
                          ? `${k.freshGraduatesPerYear.total} lulusan`
                          : `${k.population.toLocaleString('id-ID')} jiwa`}
                      </text>
                    </g>
                  );
                })}

                {/* Major Rivers (Sungai Segah & Sungai Kelay meeting at Tanjung Redeb) */}
                <path
                  d="M 280,180 Q 360,260 440,320"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                  strokeDasharray="4 2"
                />
                <path
                  d="M 240,400 Q 340,380 440,320"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeOpacity="0.7"
                  strokeDasharray="4 2"
                />
                <path
                  d="M 440,320 Q 510,310 590,300"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeOpacity="0.8"
                />

                {/* Industrial Hotspot Pins */}
                {hotspots.map((hs, i) => (
                  <g key={i} className="cursor-pointer group">
                    <circle
                      cx={hs.x}
                      cy={hs.y}
                      r="4"
                      fill={
                        hs.sector === 'mining'
                          ? '#f97316'
                          : hs.sector === 'tourism'
                          ? '#06b6d4'
                          : hs.sector === 'agriculture'
                          ? '#84cc16'
                          : hs.sector === 'logistics'
                          ? '#a855f7'
                          : '#10b981'
                      }
                      className="animate-pulse"
                    />
                    <circle
                      cx={hs.x}
                      cy={hs.y}
                      r="7"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1"
                      strokeOpacity="0.6"
                    />
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Map Legend */}
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-medium">Legenda:</span>
              {activeLayer === 'absorption' ? (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Tinggi (88-100)
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-teal-600 inline-block" /> Menengah (80-87)
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-sky-700 inline-block" /> Berkembang (&lt;80)
                  </span>
                </div>
              ) : activeLayer === 'fresh_grads' ? (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-amber-600 inline-block" /> &gt;2000 Lulusan/Th
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-amber-800 inline-block" /> 500-2000
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-sky-800 inline-block" /> &lt;500
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-emerald-600 inline-block" /> Sangat Padat
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-sky-700 inline-block" /> Sedang
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <span className="w-3 h-3 rounded bg-slate-800 inline-block" /> Pedalaman Luas
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Tambang
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" /> Ekowisata
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-lime-400 inline-block" /> Sawit
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" /> Pelabuhan/IKN
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar District Detail Inspector */}
        <div className="lg:col-span-4 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between shadow-xl">
          {selectedKecamatan ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Profil Wilayah Terpilih
                  </div>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    Kecamatan {selectedKecamatan.name}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Ibukota: <span className="text-slate-200">{selectedKecamatan.capital}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Indeks Peluang Kerja</div>
                  <div className="text-2xl font-bold font-mono text-emerald-400">
                    {selectedKecamatan.laborAbsorptionIndex}
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                {selectedKecamatan.description}
              </p>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Jumlah Penduduk</div>
                  <div className="font-bold text-white font-mono mt-0.5">
                    {selectedKecamatan.population.toLocaleString('id-ID')} jiwa
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Luas Wilayah</div>
                  <div className="font-bold text-white font-mono mt-0.5">
                    {selectedKecamatan.areaKm2.toLocaleString('id-ID')} km²
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Lulusan Baru / Thn</div>
                  <div className="font-bold text-amber-400 font-mono mt-0.5">
                    {selectedKecamatan.freshGraduatesPerYear.total} orang
                  </div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="text-slate-400 text-[11px]">Tingkat Pengangguran</div>
                  <div className="font-bold text-emerald-400 font-mono mt-0.5">
                    {selectedKecamatan.unemploymentRate}%
                  </div>
                </div>
              </div>

              {/* Primary Strategic Industries */}
              <div>
                <div className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" />
                  Sektor Industri Strategis Unggulan:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedKecamatan.primaryIndustries.map((ind, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-emerald-300"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Employers */}
              <div>
                <div className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                  Pemberi Kerja Utama (Kemitraan Rekrutmen):
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {selectedKecamatan.keyEmployers.map((emp, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <ChevronRight className="w-3 h-3 text-emerald-500" />
                      <span>{emp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Economic Pillar shares */}
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1.5">
                  Pilar Perekonomian Kecamatan:
                </div>
                <div className="space-y-1.5">
                  {selectedKecamatan.economicPillars.map((p, i) => (
                    <div key={i} className="space-y-0.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-300">{p.sector}</span>
                        <span className="font-mono text-emerald-400 font-semibold">
                          {p.sharePercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full"
                          style={{ width: `${p.sharePercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-emerald-400">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-sm">Pilih Kecamatan di Peta</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                Arahkan kursor atau klik salah satu dari 13 kecamatan di peta untuk menganalisis kepadatan penduduk, peluang lulusan baru, dan perusahaan industri strategis terkait.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
