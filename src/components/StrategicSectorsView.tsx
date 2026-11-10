import React, { useState } from 'react';
import {
  Pickaxe,
  Trees,
  Palmtree,
  Fish,
  Ship,
  Leaf,
  Building2,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { STRATEGIC_SECTORS } from '../data/strategicSectors';
import { StrategicSector } from '../types';

export const StrategicSectorsView: React.FC = () => {
  const [selectedSector, setSelectedSector] = useState<StrategicSector>(STRATEGIC_SECTORS[0]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'Pickaxe':
        return <Pickaxe className="w-5 h-5" />;
      case 'Trees':
        return <Trees className="w-5 h-5" />;
      case 'Palmtree':
        return <Palmtree className="w-5 h-5" />;
      case 'Fish':
        return <Fish className="w-5 h-5" />;
      case 'Ship':
        return <Ship className="w-5 h-5" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5" />;
      case 'Building2':
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950/60 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="space-y-1 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            Katalog Industri Strategis Daerah
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            7 Sektor Industri Prioritas Kabupaten Berau
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Daftar sektor penggerak utama Produk Domestik Regional Bruto (PDRB) Berau dengan proyeksi permintaan formasi lulusan baru, rentang remunerasi, dan persyaratan kepatuhan Perda Tenaga Kerja Lokal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sektor List Navigation */}
        <div className="lg:col-span-5 space-y-2.5">
          {STRATEGIC_SECTORS.map((sector) => {
            const isSelected = selectedSector.id === sector.id;
            return (
              <div
                key={sector.id}
                onClick={() => setSelectedSector(sector)}
                className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-slate-850 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl flex-shrink-0 ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {renderIcon(sector.icon)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">
                      {sector.code}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      +{sector.growthRateAnnual}% / thn
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
                    {sector.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                    {sector.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Sector Deep-Dive Card */}
        <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                {renderIcon(selectedSector.icon)}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {selectedSector.code}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {selectedSector.name}
                </h3>
              </div>
            </div>

            <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-right self-start">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Target Naker Lokal</span>
              <div className="text-base font-bold font-mono text-emerald-400">
                {selectedSector.localContentTarget}% Kuota
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            {selectedSector.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Tenaga Kerja Aktif</div>
              <div className="text-sm font-bold font-mono text-white mt-1">
                {selectedSector.currentWorkforce.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Kebutuhan 2025</div>
              <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                +{selectedSector.projectedDemand2025.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Kebutuhan 2028</div>
              <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
                +{selectedSector.projectedDemand2028.toLocaleString('id-ID')}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-slate-400 text-[10px]">Risiko Otomasi</div>
              <div className="text-sm font-bold font-mono text-amber-400 mt-1">
                {selectedSector.automationRisk}
              </div>
            </div>
          </div>

          {/* Salary Scale */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-semibold text-white">Rentang Gaji Awal Fresh Graduate:</div>
                <div className="text-[11px] text-slate-400">Standar UMK Berau Rp 3,83 Jt / bulan</div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-base font-bold font-mono text-emerald-400">
                Rp {selectedSector.freshGradStartingSalary.min} - {selectedSector.freshGradStartingSalary.max} Juta
              </span>
              <div className="text-[10px] text-slate-500">per bulan (Gross)</div>
            </div>
          </div>

          {/* Top Job Roles in this sector */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
              Formasi Pekerjaan Unggulan untuk Lulusan Baru:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedSector.topRoles.map((role, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate">{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Academic Majors */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">
              Jurusan / Program Studi Prioritas:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedSector.requiredMajors.map((m, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-xs font-medium text-emerald-300 border border-slate-700"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Key Employers and Kecamatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                Perusahaan / Pemberi Kerja Terkemuka:
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {selectedSector.keyEmployers.map((emp, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{emp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Kecamatan Sentra Konsentrasi:
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedSector.primaryKecamatan.map((k, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-300"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
