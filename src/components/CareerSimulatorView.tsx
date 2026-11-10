import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  CheckCircle,
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  RefreshCw,
  BookOpen,
} from 'lucide-react';
import { CareerPredictionResult } from '../types';
import { KECAMATAN_LIST } from '../data/berauDemographics';

export const CareerSimulatorView: React.FC = () => {
  const [educationLevel, setEducationLevel] = useState<'SMK' | 'D3/D4' | 'S1'>('S1');
  const [major, setMajor] = useState('Teknik Pertambangan');
  const [customMajor, setCustomMajor] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Pemahaman K3 Dasar', 'Pengoperasian Komputer & Office']);
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [preferredKecamatan, setPreferredKecamatan] = useState('Seluruh Kecamatan di Berau');
  const [willingToRemote, setWillingToRemote] = useState(true);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [predictionResult, setPredictionResult] = useState<CareerPredictionResult | null>(null);

  // Common majors in Berau region
  const commonMajors = [
    'Teknik Pertambangan',
    'Teknik Mesin / Otomotif Alat Berat',
    'Teknik Elektro / Mekatronika',
    'Agroteknologi / Agribisnis Perkebunan Sawit',
    'Pariwisata & Manajemen Perhotelan',
    'Ilmu Kelautan / Budidaya Perikanan',
    'Teknik Sipil & Manajemen Konstruksi',
    'Teknik Informatika / Sistem Informasi',
    'Manajemen Keuangan / Akuntansi',
    'Ilmu Keperawatan / Kesehatan Masyarakat',
    'Kehutanan & Konservasi Lingkungan',
    'Lainnya (Tulis Sendiri)',
  ];

  const availableSkills = [
    'Pemahaman K3 Dasar',
    'Pengoperasian Komputer & Office',
    'Bahasa Inggris Komunikatif',
    'Pemetaan SIG / ArcGIS / Drone',
    'Pemeliharaan Mesin & Troubleshooting',
    'Analisis Data Statistik & Excel Lanjut',
    'Keahlian Menyelam (Scuba Diving)',
    'Komunikasi Publik & Negosiasi',
  ];

  const availableCerts = [
    'Sertifikat Ahli K3 Umum Kemenaker',
    'Pengawas Operasional Pertama (POP) Tambang',
    'Sertifikasi Kompetensi BNSP Bidang Terkait',
    'Lisensi PADI / SSI Open Water / Divemaster',
    'Brevet Pajak A & B',
    'SIM B2 Umum / Pengemudi Alat Berat',
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleCert = (cert: string) => {
    if (selectedCerts.includes(cert)) {
      setSelectedCerts(selectedCerts.filter((c) => c !== cert));
    } else {
      setSelectedCerts([...selectedCerts, cert]);
    }
  };

  const runPrediction = async (triggerAi: boolean = false) => {
    const finalMajor = major === 'Lainnya (Tulis Sendiri)' ? customMajor || 'Umum' : major;

    setIsLoadingAi(triggerAi);

    try {
      const response = await fetch('/api/predictive/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          educationLevel,
          major: finalMajor,
          skills: selectedSkills,
          certifications: selectedCerts,
          preferredKecamatan: preferredKecamatan === 'Seluruh Kecamatan di Berau' ? undefined : preferredKecamatan,
          willingToRemote,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPredictionResult(data.data);
      }
    } catch (err) {
      console.error('Error running prediction:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Run initial prediction on load if not yet calculated
  React.useEffect(() => {
    runPrediction(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="max-w-3xl space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Simulator Karir Lulusan Baru & AI Advisor
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Kalkulator Kecocokan Karir Sektor Strategis Kabupaten Berau
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Simulasikan profil akademik dan keahlian Anda untuk memproyeksikan peluang serapan di industri pertambangan, hilirisasi sawit, ekowisata kepulauan, logistik maritim, dan layanan perkotaan Berau.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Candidate Input Form */}
        <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Award className="w-4 h-4 text-emerald-400" />
            Profil Lulusan Baru (Fresh Graduate)
          </h3>

          {/* Jenjang Pendidikan */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Jenjang Pendidikan Terakhir:</label>
            <div className="grid grid-cols-3 gap-2">
              {(['SMK', 'D3/D4', 'S1'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setEducationLevel(lvl)}
                  className={`py-2 text-xs font-bold rounded-lg border transition ${
                    educationLevel === lvl
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Jurusan */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Jurusan / Program Studi:</label>
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {commonMajors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {major === 'Lainnya (Tulis Sendiri)' && (
              <input
                type="text"
                placeholder="Masukkan jurusan Anda..."
                value={customMajor}
                onChange={(e) => setCustomMajor(e.target.value)}
                className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>

          {/* Hard Skills Checkboxes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Keahlian Tambahan / Hard Skills:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`p-2 rounded-lg text-[11px] text-left border transition flex items-center justify-between ${
                    selectedSkills.includes(skill)
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <span className="truncate">{skill}</span>
                  {selectedSkills.includes(skill) && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Sertifikasi */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Sertifikasi yang Dimiliki (Opsional):</label>
            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
              {availableCerts.map((cert) => (
                <button
                  key={cert}
                  type="button"
                  onClick={() => toggleCert(cert)}
                  className={`w-full p-2 rounded-lg text-[11px] text-left border transition flex items-center justify-between ${
                    selectedCerts.includes(cert)
                      ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
                      : 'bg-slate-950 border-slate-800/80 text-slate-400 hover:bg-slate-850'
                  }`}
                >
                  <span className="truncate">{cert}</span>
                  {selectedCerts.includes(cert) && <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Preferensi Penempatan & Kesediaan Remote */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Preferensi Wilayah:</label>
              <select
                value={preferredKecamatan}
                onChange={(e) => setPreferredKecamatan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Seluruh Kecamatan di Berau">Seluruh Kecamatan (Fleksibel)</option>
                {KECAMATAN_LIST.map((k) => (
                  <option key={k.id} value={k.name}>
                    {k.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1 flex flex-col justify-end">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2 cursor-pointer p-2 bg-slate-950 rounded-lg border border-slate-800">
                <input
                  type="checkbox"
                  checked={willingToRemote}
                  onChange={(e) => setWillingToRemote(e.target.checked)}
                  className="accent-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-[11px] text-slate-300">Siap Ditugaskan di Site / Pesisir</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => runPrediction(false)}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Hitung Skor Kecocokan</span>
            </button>
            <button
              type="button"
              onClick={() => runPrediction(true)}
              disabled={isLoadingAi}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" style={{ animationDuration: isLoadingAi ? '1s' : '0s' }} />
              <span>{isLoadingAi ? 'Menganalisis AI...' : 'Analisis AI Mendalam'}</span>
            </button>
          </div>
        </div>

        {/* Prediction Results & Roadmap */}
        <div className="lg:col-span-7 space-y-4">
          {predictionResult ? (
            <div className="space-y-4">
              {/* Top Score Box */}
              <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Hasil Pemodelan Prediktif Berau
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Kesesuaian dengan Pasar Kerja: <span className="text-emerald-300">{predictionResult.primarySector}</span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Sektor Sekunder: <span className="text-slate-200 font-medium">{predictionResult.secondarySector}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-bold text-slate-400">Indeks Kecocokan</div>
                    <div className="text-3xl font-black font-mono text-emerald-400">
                      {predictionResult.matchScore}%
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Salary & Hiring District Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Estimasi Gaji Awal Fresh Graduate</div>
                    <div className="text-base font-bold font-mono text-white mt-0.5">
                      Rp {predictionResult.estimatedStartingSalary.min} - {predictionResult.estimatedStartingSalary.max} Jt
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-0.5">
                      Di atas UMK Berau (Rp 3,83 Jt)
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Kecamatan Penyerapan Terbanyak</div>
                    <div className="text-xs font-bold text-white mt-1 flex flex-wrap gap-1">
                      {predictionResult.topHiringKecamatan.map((k, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Roles & Target Companies */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  Formasi Jabatan yang Direkomendasikan:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {predictionResult.recommendedRoles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-2"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span className="truncate">{role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Certifications & Skills to Bridge Gap */}
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-400" />
                  Sertifikasi & Kualifikasi Pengungkit Lolos Seleksi:
                </h4>
                <div className="space-y-1.5">
                  {predictionResult.recommendedCertifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs p-2 rounded-lg bg-slate-950/50 border border-slate-800/80 text-indigo-300"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Strategic Pathway / Policy Advisor Output */}
              {predictionResult.aiDetailedAdvice && (
                <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <h4 className="text-sm font-bold text-white">
                        Analisis Penasihat Karir & Regulasi Daerah (Gemini AI)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Perda No. 8/2018 Naker Lokal
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line space-y-2">
                    {predictionResult.aiDetailedAdvice}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 space-y-2 bg-slate-900/50 rounded-2xl border border-slate-800">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">Klik tombol &ldquo;Hitung Skor Kecocokan&rdquo; untuk memulai simulasi karir.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
