import React, { useState } from 'react';
import {
  Compass,
  Wrench,
  Stethoscope,
  Pickaxe,
  Palmtree,
  Ship,
  Laptop,
  Building2,
  Leaf,
  Utensils,
  GraduationCap,
  Shield,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  BookOpen,
  DollarSign,
  MapPin,
  School,
  FileText,
  Presentation,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import {
  STUDENT_PROFESSIONS_DATA,
  STUDENT_ASPIRATIONS_SURVEY_META,
  ASPIRATION_DISPARITY_DATA,
} from '../data/studentAspirations';
import { StudentProfessionAspiration } from '../types';
import { KECAMATAN_LIST } from '../data/berauDemographics';

export const StudentAspirationsView: React.FC = () => {
  // Navigation sub-tabs
  const [subView, setSubView] = useState<'catalog' | 'disparity' | 'interactive' | 'presentation'>('catalog');

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedProfession, setSelectedProfession] = useState<StudentProfessionAspiration>(STUDENT_PROFESSIONS_DATA[0]);

  // Interactive Student Aspirations Checker State
  const [studentSchool, setStudentSchool] = useState<string>('SMKN 1 Berau (Tanjung Redeb)');
  const [studentKecamatan, setStudentKecamatan] = useState<string>('Tanjung Redeb');
  const [studentGrade, setStudentGrade] = useState<string>('Kelas 11 (Persiapan Magang / PKL)');
  const [chosenProfessionTitle, setChosenProfessionTitle] = useState<string>(STUDENT_PROFESSIONS_DATA[0].professionTitle);
  const [customAmbitionNote, setCustomAmbitionNote] = useState<string>('');
  const [isLoadingAiRoadmap, setIsLoadingAiRoadmap] = useState<boolean>(false);
  const [aiRoadmapResult, setAiRoadmapResult] = useState<string>('');

  const categories = [
    'Semua',
    'Tambang & Energi',
    'Kesehatan & Medis',
    'Pariwisata & Bahari',
    'Pertanian & Sawit',
    'Kemaritiman & Logistik',
    'Teknologi & Digital',
    'Pemerintahan & Hukum',
    'Konservasi Lingkungan',
    'Bisnis & Kreatif',
    'Pendidikan',
  ];

  const berauSchools = [
    'SMKN 1 Berau (Teknik Mesin & Otomotif)',
    'SMKN 2 Berau (Pariwisata & Bisnis)',
    'SMAN 1 Berau (Tanjung Redeb)',
    'SMAN 2 Berau (Tanjung Redeb)',
    'SMAN 4 Berau (Sambaliung)',
    'SMAN 6 Berau (Talisayan - Pesisir Selatan)',
    'SMKN 1 Segah (Pertanian & Kelapa Sawit)',
    'SMAN 7 Berau (Pulau Derawan)',
    'SMK Perikanan & Kelautan Maratua',
    'MAN Berau (Madrasah Aliyah Negeri)',
    'SMA Swasta / Pondok Pesantren di Berau',
  ];

  // Helper to render lucide icon dynamically
  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className={className} />;
      case 'Stethoscope':
        return <Stethoscope className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'Pickaxe':
        return <Pickaxe className={className} />;
      case 'Palmtree':
        return <Palmtree className={className} />;
      case 'Ship':
        return <Ship className={className} />;
      case 'Laptop':
        return <Laptop className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'Leaf':
        return <Leaf className={className} />;
      case 'Utensils':
        return <Utensils className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Shield':
      default:
        return <Shield className={className} />;
    }
  };

  const filteredProfessions = STUDENT_PROFESSIONS_DATA.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch =
      p.professionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.majorEmployersInBerau.some((emp) => emp.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getOpportunityBadgeColor = (status: StudentProfessionAspiration['opportunityStatus']) => {
    switch (status) {
      case 'Sangat Tinggi':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Tinggi':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40';
      case 'Moderat':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Kompetitif':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Sangat Ketat':
      default:
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
    }
  };

  const getOpportunityBarColor = (pct: number) => {
    if (pct >= 90) return 'bg-emerald-500';
    if (pct >= 80) return 'bg-teal-500';
    if (pct >= 70) return 'bg-sky-500';
    if (pct >= 40) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  // Find currently selected profession in interactive checker
  const interactiveTargetProf =
    STUDENT_PROFESSIONS_DATA.find((p) => p.professionTitle === chosenProfessionTitle) ||
    STUDENT_PROFESSIONS_DATA[0];

  // Call AI for student personalized roadmap
  const generateAiRoadmap = async () => {
    setIsLoadingAiRoadmap(true);
    try {
      const res = await fetch('/api/aspirations/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionTitle: interactiveTargetProf.professionTitle,
          studentGrade,
          schoolName: studentSchool,
          originKecamatan: studentKecamatan,
          specificInterest: customAmbitionNote,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAiRoadmapResult(data.roadmap);
      }
    } catch (err) {
      console.error('Failed to generate student roadmap:', err);
    } finally {
      setIsLoadingAiRoadmap(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-emerald-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Modul Sinkronisasi Cita-cita Siswa & Ketenagakerjaan Daerah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Cita-cita (Profesi) Siswa & Presentasi Peluang Kerja Berau
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Memetakan preferensi profesi impian pelajar SMA/SMK se-Kabupaten Berau dan menyinkronkannya dengan formasi industri riil (pertambangan, hilirisasi sawit, ekowisata bahari, logistik IKN) untuk mengukur persentase peluang kelolosan karir.
            </p>
          </div>

          <div className="bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800/80 flex-shrink-0 self-start md:self-auto text-right">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Dasar Kebijakan Perlindungan</div>
            <div className="text-xs font-bold text-emerald-400 mt-0.5">Perda Kab. Berau No. 8/2018</div>
            <div className="text-[11px] text-slate-300">Prioritas 70% Tenaga Kerja Lokal</div>
          </div>
        </div>
      </div>

      {/* KPI Highlight Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Siswa Tersurvei</span>
            <School className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {STUDENT_ASPIRATIONS_SURVEY_META.totalStudentsSurveyed.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Pelajar SMA/SMK/MA 13 Kecamatan
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Rata-rata Peluang Terserap</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {STUDENT_ASPIRATIONS_SURVEY_META.averageAbsorptionRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Berdasarkan formasi industri lokal
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Peluang Tertinggi</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-sm font-bold text-teal-300 mt-1 truncate">
            Mekanik (96%) &amp; Dokter (92%)
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Defisit pelamar lokal terampil
          </div>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="text-slate-400 text-xs flex items-center justify-between">
            <span>Paling Kompetitif</span>
            <AlertCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-sm font-bold text-rose-300 mt-1 truncate">
            ASN / PNS Berau (18%)
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            21,4% peminat vs formasi 3,7%
          </div>
        </div>
      </div>

      {/* Sub-view switcher tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setSubView('catalog')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            subView === 'catalog'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Katalog Cita-cita &amp; Peluang Kerja</span>
        </button>

        <button
          onClick={() => setSubView('disparity')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            subView === 'disparity'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Grafik Kesenjangan (Minat vs Realita)</span>
        </button>

        <button
          onClick={() => setSubView('interactive')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            subView === 'interactive'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>Simulasi Cek Cita-citaku &amp; Roadmap AI</span>
        </button>

        <button
          onClick={() => setSubView('presentation')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 ${
            subView === 'presentation'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/30'
              : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
          }`}
        >
          <Presentation className="w-4 h-4" />
          <span>Slide Presentasi untuk Sekolah &amp; Bappeda</span>
        </button>
      </div>

      {/* SUB-VIEW 1: KATALOG CITA-CITA & PELUANG KERJA */}
      {subView === 'catalog' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                <Filter className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative flex-shrink-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari cita-cita / profesi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
                />
              </div>
            </div>
          </div>

          {/* Master Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Profession Cards */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredProfessions.map((prof) => {
                const isSelected = selectedProfession.id === prof.id;
                return (
                  <div
                    key={prof.id}
                    onClick={() => setSelectedProfession(prof)}
                    className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-slate-850 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {renderIcon(prof.iconName, 'w-5 h-5')}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate">
                          {prof.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getOpportunityBadgeColor(
                            prof.opportunityStatus
                          )}`}
                        >
                          Peluang: {prof.absorptionOpportunityPercent}%
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white truncate">{prof.professionTitle}</h4>

                      {/* Progress Bar of Opportunity */}
                      <div className="space-y-0.5 pt-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                          <span>Daya Serap Berau</span>
                          <span className="font-bold text-emerald-400">
                            {prof.absorptionOpportunityPercent}% ({prof.opportunityStatus})
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getOpportunityBarColor(
                              prof.absorptionOpportunityPercent
                            )}`}
                            style={{ width: `${prof.absorptionOpportunityPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 font-mono">
                        <span>Minat Siswa: {prof.studentInterestPercent}%</span>
                        <span className="text-slate-300">~{prof.berauMarketDemandAnnual} lowongan/th</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: In-Depth Profession Detail */}
            <div className="lg:col-span-7 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
              {/* Header Profile */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                    {renderIcon(selectedProfession.iconName, 'w-6 h-6')}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                      {selectedProfession.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                      {selectedProfession.professionTitle}
                    </h3>
                  </div>
                </div>

                <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 text-right self-start sm:self-auto">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Presentasi Peluang Kerja</div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    {selectedProfession.absorptionOpportunityPercent}%
                  </div>
                  <div className="text-[10px] text-emerald-300 font-medium">
                    Status: {selectedProfession.opportunityStatus}
                  </div>
                </div>
              </div>

              {/* Opportunity & Disparity Callout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Analisis Peluang Pasar Berau:
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedProfession.opportunityAnalysis}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Kesenjangan (Disparitas Minat):
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedProfession.gapAnalysis}
                  </p>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Minat Siswa Berau</div>
                  <div className="text-sm font-bold font-mono text-white mt-1">
                    {selectedProfession.studentInterestPercent}%
                  </div>
                  <div className="text-[10px] text-slate-500">~{selectedProfession.studentCountSurveyd} pelajar</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Formasi Tahunan</div>
                  <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                    {selectedProfession.berauMarketDemandAnnual.toLocaleString('id-ID')}
                  </div>
                  <div className="text-[10px] text-slate-500">Lowongan / tahun</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Estimasi Gaji Awal</div>
                  <div className="text-sm font-bold font-mono text-cyan-400 mt-1">
                    Rp {selectedProfession.estimatedStartingSalary.min} - {selectedProfession.estimatedStartingSalary.max} Jt
                  </div>
                  <div className="text-[10px] text-slate-500">Di atas UMK Berau</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Perda 70% Lokal</div>
                  <div className="text-sm font-bold font-mono text-indigo-400 mt-1">
                    Diproteksi
                  </div>
                  <div className="text-[10px] text-slate-500">KTP Berau prioritas</div>
                </div>
              </div>

              {/* Education Pathways & Key Schools */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-emerald-400" />
                  Jalur Pendidikan &amp; Kampus / SMK Rujukan di Berau &amp; Kaltim:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProfession.educationPathways.map((edu, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 text-xs text-slate-200 border border-slate-800 font-medium"
                    >
                      {edu}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Certifications Needed */}
              <div>
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  Sertifikasi Kunci yang Perlu Disiapkan Sejak Dini:
                </h4>
                <div className="space-y-1.5">
                  {selectedProfession.keyCertificationsNeeded.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-indigo-300 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Major Employers & Hiring Districts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    Perusahaan / Instansi Penyerap di Berau:
                  </div>
                  <ul className="space-y-1 text-slate-300">
                    {selectedProfession.majorEmployersInBerau.map((emp, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <ChevronRight className="w-3 h-3 text-emerald-400" />
                        <span>{emp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    Kecamatan Konsentrasi Penyerapan:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedProfession.hiringKecamatan.map((k, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: GRAFIK KESENJANGAN (DISPARITAS CITA-CITA VS REALITA PASAR KERJA) */}
      {subView === 'disparity' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Tabel Komparasi &amp; Presentasi Kesenjangan: Minat Siswa vs Daya Serap Pasar Berau
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Menunjukkan perbandingan antara persentase peminat siswa di sekolah dengan persentase kebutuhan formasi lowongan industri lokal, serta tingkat kepastian terserap kerja.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Profesi / Cita-cita Siswa</th>
                    <th className="py-3 px-3 text-center">Minat Siswa (%)</th>
                    <th className="py-3 px-3 text-center">Kebutuhan Industri (%)</th>
                    <th className="py-3 px-3">Presentasi Peluang (%)</th>
                    <th className="py-3 px-3">Status Kesenjangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {ASPIRATION_DISPARITY_DATA.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition">
                      <td className="py-3 px-3 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-amber-400">
                        {item.studentInterest}%
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-cyan-400">
                        {item.marketDemand}%
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getOpportunityBarColor(item.opportunityPct)}`}
                              style={{ width: `${item.opportunityPct}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-emerald-400 text-xs">
                            {item.opportunityPct}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            item.gap.includes('Defisit')
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : item.gap.includes('Surplus Peminat Ekstrem')
                              ? 'bg-rose-500/20 text-rose-300'
                              : item.gap.includes('Kelebihan')
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-teal-500/20 text-teal-300'
                          }`}
                        >
                          {item.gap}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Takeaway for BK & Dinas Pendidikan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Sektor dengan Defisit Pelamar Lokal (Peluang Emas Pelajar):
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Industri pertambangan dan perkebunan di Berau membutuhkan ribuan tenaga teknis setiap tahunnya (mekanik alat berat, asisten agronom PKS, pemandu selam berlisensi). Minat siswa saat ini masih di bawah kuota kebutuhan riil, sehingga siswa yang mengambil jalur kejuruan ini memiliki garansi penyerapan kerja hampir 100%.
              </p>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-sm font-bold text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Peringatan Jenuh untuk Formasi Tertentu:
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Lebih dari 21% siswa menyatakan cita-cita menjadi ASN / PNS, sementara formasi Pemda yang tersedia rata-rata kurang dari 220 kursi per tahun. Guru BK dan orang tua disarankan memberikan wawasan karir alternatif di sektor industri swasta modern, energi hijau, dan agribisnis berkelanjutan.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: SIMULASI CEK CITA-CITAKU (SISWA INTERAKTIF) & ROADMAP AI */}
      {subView === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Form */}
          <div className="lg:col-span-5 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Kalkulator Cita-citaku &amp; Uji Peluang</h3>
            </div>

            {/* Cita-cita Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Pilih Cita-cita / Profesi Impian Anda:</label>
              <select
                value={chosenProfessionTitle}
                onChange={(e) => setChosenProfessionTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                {STUDENT_PROFESSIONS_DATA.map((p) => (
                  <option key={p.id} value={p.professionTitle}>
                    {p.professionTitle} ({p.absorptionOpportunityPercent}% Peluang)
                  </option>
                ))}
              </select>
            </div>

            {/* Asal Sekolah */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Asal Sekolah di Kabupaten Berau:</label>
              <select
                value={studentSchool}
                onChange={(e) => setStudentSchool(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {berauSchools.map((sch, i) => (
                  <option key={i} value={sch}>
                    {sch}
                  </option>
                ))}
              </select>
            </div>

            {/* Kecamatan Domisili */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Kecamatan Domisili:</label>
              <select
                value={studentKecamatan}
                onChange={(e) => setStudentKecamatan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {KECAMATAN_LIST.map((k) => (
                  <option key={k.id} value={k.name}>
                    Kecamatan {k.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tingkat Kelas */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Tingkat Kelas Saat Ini:</label>
              <select
                value={studentGrade}
                onChange={(e) => setStudentGrade(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Kelas 10 (Fase Eksplorasi Minat)">Kelas 10 (Fase Eksplorasi Minat)</option>
                <option value="Kelas 11 (Persiapan Magang / PKL)">Kelas 11 (Persiapan Magang / PKL)</option>
                <option value="Kelas 12 (Persiapan Kelulusan & Kerja/Kuliah)">
                  Kelas 12 (Persiapan Kelulusan &amp; Kerja/Kuliah)
                </option>
                <option value="Lulusan Baru (Fresh Graduate Mencari Kerja)">
                  Lulusan Baru (Fresh Graduate Mencari Kerja)
                </option>
              </select>
            </div>

            {/* Catatan Khusus */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Minat Tambahan / Catatan Khusus (Opsional):
              </label>
              <input
                type="text"
                placeholder="Contoh: Suka mesin, ingin beasiswa, atau siap tugas pulau"
                value={customAmbitionNote}
                onChange={(e) => setCustomAmbitionNote(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={generateAiRoadmap}
                disabled={isLoadingAiRoadmap}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-emerald-200 animate-spin" style={{ animationDuration: isLoadingAiRoadmap ? '1s' : '0s' }} />
                <span>{isLoadingAiRoadmap ? 'Menyusun Roadmap Karir AI...' : 'Buat Roadmap Cita-cita Bersama AI'}</span>
              </button>
            </div>
          </div>

          {/* Right: Results Card */}
          <div className="lg:col-span-7 space-y-4">
            {/* Opportunity Quick Gauge */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Hasil Sinkronisasi Pasar Kerja Berau
                </div>
                <h4 className="text-xl font-black text-white mt-1">
                  {interactiveTargetProf.professionTitle}
                </h4>
                <div className="text-xs text-slate-400 mt-0.5">
                  Siswa: {studentSchool} • {studentKecamatan}
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 flex-shrink-0">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Presentasi Peluang</div>
                  <div className="text-3xl font-black font-mono text-emerald-400">
                    {interactiveTargetProf.absorptionOpportunityPercent}%
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* 3 Steps Forward Recommendation */}
            <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Langkah Cepat Meraih Cita-cita Ini:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400">Tahap 1: Di Sekolah</span>
                  <div className="font-semibold text-white">Perkuat Keterampilan</div>
                  <p className="text-[11px] text-slate-400">
                    Kuasai dasar teknis, disiplin K3, dan komunikasi bahasa Inggris aktif.
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-400">Tahap 2: Sertifikasi</span>
                  <div className="font-semibold text-white">BNSP / Lisensi Resmi</div>
                  <p className="text-[11px] text-slate-400">
                    {interactiveTargetProf.keyCertificationsNeeded[0]}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-indigo-400">Tahap 3: Kerja di Berau</span>
                  <div className="font-semibold text-white">Hak Kuota Perda 70%</div>
                  <p className="text-[11px] text-slate-400">
                    Prioritas lamaran kerja di {interactiveTargetProf.majorEmployersInBerau[0]}.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Generated Personalized Roadmap */}
            {aiRoadmapResult ? (
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 p-6 rounded-2xl border border-emerald-500/40 shadow-2xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">
                      Roadmap Sukses Karir Personal (Konsultan Pendidikan AI Berau)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Gemini Flash Model
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line space-y-2 font-sans">
                  {aiRoadmapResult}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-2">
                <GraduationCap className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs sm:text-sm">
                  Klik tombol <span className="text-emerald-400 font-semibold">&ldquo;Buat Roadmap Cita-cita Bersama AI&rdquo;</span> untuk mendapatkan panduan jalur belajar dan beasiswa daerah yang dipersonalisasi.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-VIEW 4: SLIDE PRESENTASI UNTUK SEKOLAH & BAPPEDA */}
      {subView === 'presentation' && (
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2 border-b border-slate-800 pb-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Presentation className="w-4 h-4" />
              Slide Eksekutif Disdik &amp; Bappeda Kab. Berau
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Presentasi Peluang Karir Lulusan Sekolah &amp; Arah Kebijakan Ketenagakerjaan Berau
            </h3>
            <p className="text-xs text-slate-400">
              Bahan paparan sinkronisasi kurikulum SMK/SMA dengan Rencana Pembangunan Jangka Menengah Daerah (RPJMD) Kabupaten Berau 2024–2029.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Slide Box 1 */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                <span>01. Realita Bonus Demografi Berau</span>
                <span className="font-mono">70,03% Usia Kerja</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Potensi Ledakan Angkatan Kerja Muda
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kabupaten Berau menghasilkan sekitar 6.550 lulusan baru setiap tahun. Tanpa arahan karir berbasis data industri, risiko *pengangguran terdidik* akibat salah memilih jurusan dapat mengancam stabilitas ekonomi lokal.
              </p>
            </div>

            {/* Slide Box 2 */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span>02. Prioritas Industri Hilirisasi</span>
                <span className="font-mono">7 Sektor Unggulan</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Peralihan ke Vokasi Bernilai Tambah
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kebutuhan operator mekanik alat berat, asisten pabrik CPO kelapa sawit, instruktur selam di Maratua/Derawan, dan awak logistik laut penyangga IKN di Mantaritip mencapai lebih dari 4.500 formasi riil setiap tahun dengan daya serap mencapai di atas 85%.
              </p>
            </div>

            {/* Slide Box 3 */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                <span>03. Intervensi Bimbingan Karir (BK)</span>
                <span className="font-mono">Reorientasi Minat</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Mengurangi Kejenuhan Peminat Birokrasi
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Sebanyak 21,4% siswa masih terpaku ingin menjadi ASN padahal kuota penerimaan Pemkab Berau sangat terbatas (&lt;250 formasi). Guru BK di 13 kecamatan perlu dibekali data Laboratorium Kependudukan untuk mengalihkan siswa ke jalur industri swasta dan wirausaha maritim.
              </p>
            </div>

            {/* Slide Box 4 */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                <span>04. Penguatan Regulasi Naker Lokal</span>
                <span className="font-mono">Perda No. 8/2018</span>
              </div>
              <h4 className="text-sm font-bold text-white">
                Sinergi Sertifikasi BNSP &amp; Beasiswa Berau Cerdas
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dinas Tenaga Kerja dan Transmigrasi (Disnakertrans) bersama BLK dan CSR perusahaan harus memperbanyak sertifikasi gratis bagi lulusan SMK lokal agar syarat kuota 70% naker lokal terpenuhi secara kualitatif.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
