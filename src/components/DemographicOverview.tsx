import React, { useState } from 'react';
import {
  Users,
  TrendingUp,
  GraduationCap,
  Scale,
  ShieldCheck,
  Briefcase,
  Layers,
  Search,
  ArrowUpDown,
  Compass,
} from 'lucide-react';
import { BERAU_TOTAL_STATS, AGE_PYRAMID_DATA, EDUCATION_LEVEL_DATA, KECAMATAN_LIST } from '../data/berauDemographics';
import { KecamatanData } from '../types';

interface DemographicOverviewProps {
  simulatedPopulation: number;
  onSelectKecamatan: (k: KecamatanData) => void;
  onSwitchToMap: () => void;
}

export const DemographicOverview: React.FC<DemographicOverviewProps> = ({
  simulatedPopulation,
  onSelectKecamatan,
  onSwitchToMap,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'population' | 'density' | 'freshGrads' | 'laborIndex'>('population');
  const [sortAsc, setSortAsc] = useState(false);
  const [hoveredAgeGroup, setHoveredAgeGroup] = useState<string | null>(null);

  const filteredKecamatan = KECAMATAN_LIST.filter((k) =>
    k.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.primaryIndustries.some((ind) => ind.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => {
    let valA = 0;
    let valB = 0;
    if (sortField === 'population') {
      valA = a.population;
      valB = b.population;
    } else if (sortField === 'density') {
      valA = a.density;
      valB = b.density;
    } else if (sortField === 'freshGrads') {
      valA = a.freshGraduatesPerYear.total;
      valB = b.freshGraduatesPerYear.total;
    } else if (sortField === 'laborIndex') {
      valA = a.laborAbsorptionIndex;
      valB = b.laborAbsorptionIndex;
    }
    return sortAsc ? valA - valB : valB - valA;
  });

  const maxPyramidVal = Math.max(...AGE_PYRAMID_DATA.map((d) => Math.max(d.male, d.female)));

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/50 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <Compass className="w-3.5 h-3.5" />
              Observatorium Kependudukan Bumi Batiwakkal
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Profil Demografi & Ketenagakerjaan Kabupaten Berau
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Memantau dinamika 13 kecamatan seluas 34.127 km² dari pesisir kepulauan Derawan–Maratua hingga pedalaman Hutan Wehea Kelay dan koridor industri batubara–sawit Berau.
            </p>
          </div>
          <button
            onClick={onSwitchToMap}
            className="self-start md:self-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Jelajahi Peta Spasial 13 Kecamatan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Penduduk</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono">
            {simulatedPopulation.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+{BERAU_TOTAL_STATS.annualGrowthRate}% / tahun</span>
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Usia Produktif (15-64)</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-cyan-400 font-mono">
            {BERAU_TOTAL_STATS.productiveAgePopulation.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span className="text-cyan-300 font-semibold">70.03%</span> (Bonus Demografi)
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Lulusan Baru / Thn</span>
            <GraduationCap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-amber-400 font-mono">
            {BERAU_TOTAL_STATS.freshGraduatesAnnual.total.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            SMA/SMK & Perguruan Tinggi
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Rasio Jenis Kelamin</span>
            <Scale className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono">
            {BERAU_TOTAL_STATS.sexRatio}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            112 Laki-laki / 100 Perempuan
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Dependency Ratio</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-white font-mono">
            {BERAU_TOTAL_STATS.dependencyRatio}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Beban ketergantungan rendah
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">UMK Berau 2024</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
            Rp 3,83 Jt
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Standar minimum regional
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Piramida Penduduk & Tingkat Pendidikan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Population Pyramid */}
        <div className="lg:col-span-7 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                Piramida Penduduk Kabupaten Berau (Struktur Usia & Gender)
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                Tipe Ekspansif Menuju Stasioner
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Perhatikan penggelembungan pada rentang usia 15–29 tahun, menandakan fase puncak bonus demografi dan tingginya arus fresh graduate pencari kerja di Berau.
            </p>
          </div>

          <div className="space-y-1.5 py-2">
            <div className="grid grid-cols-12 text-[10px] text-slate-400 font-semibold pb-1 border-b border-slate-800 text-center">
              <div className="col-span-5 text-right pr-4 text-sky-400">Laki-Laki (Pria)</div>
              <div className="col-span-2 text-center text-slate-300">Kelompok Usia</div>
              <div className="col-span-5 text-left pl-4 text-rose-400">Perempuan (Wanita)</div>
            </div>

            {AGE_PYRAMID_DATA.map((item) => {
              const malePct = (item.male / maxPyramidVal) * 100;
              const femalePct = (item.female / maxPyramidVal) * 100;
              const isFreshGradCohort = item.ageGroup === '15 - 19' || item.ageGroup === '20 - 24' || item.ageGroup === '25 - 29';
              const isHovered = hoveredAgeGroup === item.ageGroup;

              return (
                <div
                  key={item.ageGroup}
                  onMouseEnter={() => setHoveredAgeGroup(item.ageGroup)}
                  onMouseLeave={() => setHoveredAgeGroup(null)}
                  className={`grid grid-cols-12 items-center text-xs py-0.5 rounded transition ${
                    isFreshGradCohort ? 'bg-emerald-950/30' : ''
                  } ${isHovered ? 'bg-slate-800/80 ring-1 ring-emerald-500/40' : ''}`}
                >
                  {/* Male Bar */}
                  <div className="col-span-5 flex items-center justify-end gap-2 pr-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.male.toLocaleString('id-ID')}
                    </span>
                    <div className="w-full bg-slate-800/60 h-3 rounded-l flex justify-end overflow-hidden max-w-[180px]">
                      <div
                        className={`h-full rounded-l transition-all duration-500 ${
                          isFreshGradCohort ? 'bg-sky-500' : 'bg-sky-600/70'
                        }`}
                        style={{ width: `${malePct}%` }}
                      />
                    </div>
                  </div>

                  {/* Age Group Label */}
                  <div className="col-span-2 text-center font-mono text-[11px] font-semibold text-slate-200">
                    <span className={isFreshGradCohort ? 'text-emerald-400 font-bold' : ''}>
                      {item.ageGroup}
                    </span>
                  </div>

                  {/* Female Bar */}
                  <div className="col-span-5 flex items-center justify-start gap-2 pl-2">
                    <div className="w-full bg-slate-800/60 h-3 rounded-r flex justify-start overflow-hidden max-w-[180px]">
                      <div
                        className={`h-full rounded-r transition-all duration-500 ${
                          isFreshGradCohort ? 'bg-rose-500' : 'bg-rose-600/70'
                        }`}
                        style={{ width: `${femalePct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.female.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-sky-500 inline-block" /> Laki-laki: 152.640 jiwa
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-rose-500 inline-block" /> Perempuan: 135.780 jiwa
              </span>
            </div>
            <div className="text-emerald-400 text-[11px] font-medium">
              *Sorotan hijau: Kohort Lulusan Baru & Angkatan Kerja Utama (15–29 th)
            </div>
          </div>
        </div>

        {/* Education Breakdown & Fresh Graduate Pipeline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                Tingkat Pendidikan Angkatan Kerja
              </h3>
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Komposisi pendidikan penduduk usia 15 tahun ke atas di Kabupaten Berau.
            </p>

            <div className="space-y-3">
              {EDUCATION_LEVEL_DATA.map((edu) => (
                <div key={edu.level} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{edu.level}</span>
                    <span className="text-slate-400 font-mono">
                      {edu.count.toLocaleString('id-ID')} jiwa ({edu.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        edu.level.includes('SMA / SMK')
                          ? 'bg-amber-400'
                          : edu.level.includes('Sarjana')
                          ? 'bg-emerald-400'
                          : edu.level.includes('Diploma')
                          ? 'bg-cyan-400'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${edu.percentage * 2}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-300">
              <div className="font-semibold text-emerald-400 mb-1">
                Kebutuhan Link & Match Vokasi Berau:
              </div>
              Lulusan SMK & Diploma mencapai 38.4% dari total basis pendidikan menengah-tinggi, membutuhkan integrasi kurikulum dengan standar K3 Tambang, sertifikasi perkebunan sawit, dan hospitality wisata bahari.
            </div>
          </div>

          {/* Annual Fresh Graduate Cohort Breakdown */}
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center justify-between">
              <span>Pipeline Lulusan Baru (Fresh Grad) per Tahun</span>
              <span className="font-mono text-emerald-400">~6.550 Orang</span>
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div className="text-amber-400 font-bold text-sm font-mono">4.350</div>
                <div className="text-[11px] text-slate-400 mt-0.5">SMA / SMK</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Operator & Teknisi</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div className="text-cyan-400 font-bold text-sm font-mono">780</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Diploma (D3/D4)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Supervisor & Analis</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <div className="text-emerald-400 font-bold text-sm font-mono">1.420</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Sarjana (S1)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Engineer & Manager</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 13 Kecamatan Comparative Demographic & Labor Table */}
      <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
              Distribusi 13 Kecamatan di Kabupaten Berau
            </h3>
            <p className="text-xs text-slate-400">
              Data penduduk, luas wilayah, kepadatan, lulusan baru tahunan, dan indeks serapan kerja daerah.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari kecamatan / industri..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Kecamatan</th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => {
                    setSortField('population');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Penduduk</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => {
                    setSortField('density');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Kepadatan (Jiwa/km²)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => {
                    setSortField('freshGrads');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Lulusan Baru/Thn</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="py-3 px-3 cursor-pointer hover:text-white"
                  onClick={() => {
                    setSortField('laborIndex');
                    setSortAsc(!sortAsc);
                  }}
                >
                  <div className="flex items-center gap-1">
                    <span>Indeks Peluang Kerja</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">Industri Utama</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredKecamatan.map((k) => (
                <tr
                  key={k.id}
                  className="hover:bg-slate-800/40 transition group cursor-pointer"
                  onClick={() => onSelectKecamatan(k)}
                >
                  <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>{k.name}</span>
                    <span className="text-[10px] text-slate-500">({k.capital})</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-200">
                    {k.population.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-300">
                    {k.density.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-400 font-semibold">
                    {k.freshGraduatesPerYear.total} org
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            k.laborAbsorptionIndex >= 85
                              ? 'bg-emerald-400'
                              : k.laborAbsorptionIndex >= 78
                              ? 'bg-cyan-400'
                              : 'bg-amber-400'
                          }`}
                          style={{ width: `${k.laborAbsorptionIndex}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-200">
                        {k.laborAbsorptionIndex}/100
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {k.primaryIndustries.slice(0, 2).map((ind, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectKecamatan(k);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition text-xs"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
