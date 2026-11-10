import React from 'react';
import { X, MapPin, Users, GraduationCap, Briefcase, TrendingUp, Building2, CheckCircle2 } from 'lucide-react';
import { KecamatanData } from '../types';

interface DistrictDetailModalProps {
  kecamatan: KecamatanData | null;
  onClose: () => void;
  onSimulateCareer: (kecamatanName: string) => void;
}

export const DistrictDetailModal: React.FC<DistrictDetailModalProps> = ({
  kecamatan,
  onClose,
  onSimulateCareer,
}) => {
  if (!kecamatan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Kecamatan di Kabupaten Berau
            </div>
            <h3 className="text-2xl font-black text-white mt-1">
              Kecamatan {kecamatan.name}
            </h3>
            <div className="text-xs text-slate-400">
              Ibukota Kecamatan: <span className="text-slate-200 font-semibold">{kecamatan.capital}</span> • Koordinat: {kecamatan.coordinates.lat}° N, {kecamatan.coordinates.lng}° E
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          {kecamatan.description}
        </p>

        {/* 4 Core Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Users className="w-3 h-3 text-emerald-400" />
              <span>Penduduk</span>
            </div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {kecamatan.population.toLocaleString('id-ID')}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Sex Ratio: {kecamatan.sexRatio}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px]">Luas & Kepadatan</div>
            <div className="text-base font-bold font-mono text-white mt-1">
              {kecamatan.density.toFixed(1)}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              {kecamatan.areaKm2.toLocaleString('id-ID')} km²
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-amber-400" />
              <span>Lulusan Baru/Th</span>
            </div>
            <div className="text-base font-bold font-mono text-amber-400 mt-1">
              {kecamatan.freshGraduatesPerYear.total} org
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              SMA: {kecamatan.freshGraduatesPerYear.smaSmk}, PT: {kecamatan.freshGraduatesPerYear.sarjana + kecamatan.freshGraduatesPerYear.diploma}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 text-[11px] flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-cyan-400" />
              <span>Peluang Kerja</span>
            </div>
            <div className="text-base font-bold font-mono text-cyan-400 mt-1">
              {kecamatan.laborAbsorptionIndex}/100
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              TPT: {kecamatan.unemploymentRate}%
            </div>
          </div>
        </div>

        {/* Primary Industries & Key Employers */}
        <div className="space-y-3">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              Sektor Industri Strategis di {kecamatan.name}:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {kecamatan.primaryIndustries.map((ind, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs font-medium text-emerald-300"
                >
                  {ind}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              Pemberi Kerja Utama / Perusahaan Mitra:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {kecamatan.keyEmployers.map((emp, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300"
                >
                  {emp}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5-Year Demographic Trend */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            Tren Pertumbuhan Penduduk & Lulusan Baru (2021–2025):
          </h4>
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            {kecamatan.demographicTrend.map((t) => (
              <div key={t.year} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <div className="font-mono text-slate-400 text-[10px]">{t.year}</div>
                <div className="font-bold text-white font-mono mt-0.5">
                  {t.population.toLocaleString('id-ID')}
                </div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                  +{t.freshGrads} grad
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onSimulateCareer(kecamatan.name);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition shadow-lg shadow-emerald-950/40 flex items-center gap-2"
          >
            <span>Simulasikan Karir di Wilayah Ini</span>
          </button>
        </div>
      </div>
    </div>
  );
};
