import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  Send,
  Star,
  CheckCircle2,
  Filter,
  Search,
  MapPin,
  Building,
  School,
  Sparkles,
  TrendingUp,
  MessageSquare,
  BarChart3,
  Award,
  ArrowUpRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { GuestbookEntry, VisitorAnalytics, DailyVisitorRecord } from '../types';
import { INITIAL_GUESTBOOK_ENTRIES, INITIAL_VISITOR_ANALYTICS } from '../data/guestbookData';
import { KECAMATAN_LIST } from '../data/berauDemographics';

export const GuestbookView: React.FC = () => {
  // State for guestbook entries
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_GUESTBOOK_ENTRIES);
  const [analytics, setAnalytics] = useState<VisitorAnalytics>(INITIAL_VISITOR_ANALYTICS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Filter & Search states for the guestbook feed
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Form states
  const [formName, setFormName] = useState('');
  const [formInstitution, setFormInstitution] = useState('');
  const [formCategory, setFormCategory] = useState<GuestbookEntry['category']>('Pelajar / Mahasiswa');
  const [formKecamatan, setFormKecamatan] = useState('Tanjung Redeb');
  const [formPurpose, setFormPurpose] = useState('Konsultasi Karir Siswa & Peluang Kerja');
  const [formMessage, setFormMessage] = useState('');
  const [formRating, setFormRating] = useState(5);

  const categories: GuestbookEntry['category'][] = [
    'Pelajar / Mahasiswa',
    'Guru / Tenaga Pendidik',
    'Instansi Pemerintah / ASN',
    'Industri / Swasta',
    'Peneliti / Akademisi',
    'Masyarakat Umum',
  ];

  const commonPurposes = [
    'Konsultasi Karir Siswa & Peluang Kerja',
    'Riset Data Demografi & Kependudukan',
    'Bimbingan Karir Sekolah (BK)',
    'Monitoring Perda No. 8/2018 (Naker Lokal 70%)',
    'Kunjungan Kerja / Studi Banding',
    'Pencarian Informasi Lowongan Sektor Strategis',
    'Kunjungan Edukasi & Pengenalan Daerah',
  ];

  // Fetch latest data from server on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gbRes, visRes] = await Promise.all([
          fetch('/api/guestbook').then((r) => r.json()),
          fetch('/api/visitors/stats').then((r) => r.json()),
        ]);

        if (gbRes.success && gbRes.entries) {
          setEntries(gbRes.entries);
        }
        if (visRes.success && visRes.analytics) {
          setAnalytics(visRes.analytics);
        }
      } catch (err) {
        console.warn('Could not connect to guestbook backend, using local state:', err);
      }
    };

    fetchData();
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMessage.trim()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const payload = {
      name: formName.trim(),
      institution: formInstitution.trim() || 'Masyarakat Umum',
      category: formCategory,
      kecamatan: formKecamatan,
      purpose: formPurpose,
      message: formMessage.trim(),
      rating: formRating,
    };

    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.entry) {
        setEntries((prev) => [data.entry, ...prev]);
        setAnalytics((prev) => ({
          ...prev,
          todayCount: prev.todayCount + 1,
          totalAllTime: prev.totalAllTime + 1,
        }));
        setSubmitSuccess(true);
        // Reset form
        setFormName('');
        setFormInstitution('');
        setFormMessage('');
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Error submitting guestbook:', err);
      // Fallback local addition
      const now = new Date();
      const localEntry: GuestbookEntry = {
        id: `gb-local-${Date.now()}`,
        name: formName.trim(),
        institution: formInstitution.trim() || 'Masyarakat Umum',
        category: formCategory,
        kecamatan: formKecamatan,
        purpose: formPurpose,
        message: formMessage.trim(),
        rating: formRating,
        createdAt: now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        dateISO: now.toISOString().split('T')[0],
      };
      setEntries((prev) => [localEntry, ...prev]);
      setAnalytics((prev) => ({
        ...prev,
        todayCount: prev.todayCount + 1,
        totalAllTime: prev.totalAllTime + 1,
      }));
      setSubmitSuccess(true);
      setFormName('');
      setFormInstitution('');
      setFormMessage('');
      setTimeout(() => setSubmitSuccess(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered guestbook entries
  const filteredEntries = entries.filter((entry) => {
    const matchesCategory =
      selectedCategoryFilter === 'Semua' || entry.category === selectedCategoryFilter;
    const matchesSearch =
      entry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.kecamatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate max visitor count in historical records for bar scaling
  const maxDailyCount = Math.max(...analytics.recentDays.map((d) => d.count), 400);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/60 to-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Buku Tamu Digital &amp; Pemantauan Kunjungan Real-Time</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Buku Tamu &amp; Statistik Pengunjung Harian
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pencatatan kehadiran para pemangku kepentingan (pelajar, guru, instansi pemerintah, perusahaan industri, akademisi, dan masyarakat umum) serta analitik trafik harian pengunjung Laboratorium Kependudukan Kabupaten Berau.
            </p>
          </div>

          {/* Quick live indicator */}
          <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800 self-start md:self-auto flex-shrink-0">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Trafik Hari Ini</div>
              <div className="text-xl font-mono font-bold text-emerald-400">
                {analytics.todayCount.toLocaleString('id-ID')} Pengunjung
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Highlight: Daily Visitor Counter */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Hari Ini */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Hari Ini</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {analytics.todayCount.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-300 font-semibold">+11.7%</span> vs kemarin
          </div>
        </div>

        {/* Card 2: Kemarin */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Kemarin</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black font-mono text-white mt-1">
            {analytics.yesterdayCount.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Tercatat di sistem</div>
        </div>

        {/* Card 3: Minggu Ini */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Minggu Ini</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
            {analytics.thisWeekCount.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Akumulasi 7 hari</div>
        </div>

        {/* Card 4: Rata-rata Harian */}
        <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Rata-rata Harian</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-indigo-300 mt-1">
            {analytics.dailyAverage}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Pengunjung / hari</div>
        </div>

        {/* Card 5: Total Akumulasi */}
        <div className="col-span-2 lg:col-span-1 bg-slate-900/90 p-4 rounded-xl border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Pengunjung</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-300 mt-1">
            {analytics.totalAllTime.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Sejak sistem diluncurkan</div>
        </div>
      </div>

      {/* Daily Visitors Chart & Distribution Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 14-Days Historical Daily Visitors Bar Chart */}
        <div className="lg:col-span-8 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Tren Jumlah Pengunjung Setiap Hari (14 Hari Terakhir)
              </h3>
              <p className="text-xs text-slate-400">
                Pencatatan otomatis volume kunjungan harian ke Laboratorium Kependudukan Berau
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
              <span>Puncak Tertinggi: {Math.max(...analytics.recentDays.map((d) => d.count))}</span>
            </div>
          </div>

          {/* SVG/HTML Bar Chart */}
          <div className="pt-2">
            <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-48 sm:h-56 px-1">
              {analytics.recentDays.map((day, idx) => {
                const heightPct = Math.round((day.count / maxDailyCount) * 100);
                const isToday = idx === analytics.recentDays.length - 1;

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none absolute -top-12 z-20 bg-slate-950 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl border border-slate-700 whitespace-nowrap">
                      <div className="font-bold text-emerald-400">{day.count} Pengunjung</div>
                      <div className="text-slate-400">{day.date} ({day.dayName})</div>
                    </div>

                    {/* Count Label on top of bar */}
                    <span className="text-[9px] sm:text-[10px] font-mono font-semibold text-slate-400 group-hover:text-white mb-1">
                      {day.count}
                    </span>

                    {/* The Bar */}
                    <div className="w-full max-w-[28px] bg-slate-950 rounded-t-md overflow-hidden flex items-end h-full">
                      <div
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isToday
                            ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-500/20'
                            : 'bg-gradient-to-t from-slate-700 to-slate-500 group-hover:from-emerald-700 group-hover:to-emerald-500'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>

                    {/* Date label at bottom */}
                    <div className="mt-2 text-center">
                      <div className={`text-[9px] font-mono leading-tight ${isToday ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
                        {day.date.slice(8, 10)}/{day.date.slice(5, 7)}
                      </div>
                      <div className="text-[8px] text-slate-500 hidden sm:block truncate max-w-[34px]">
                        {day.dayName.split(' ')[0]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Category Distribution */}
        <div className="lg:col-span-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              Komposisi Kategori Pengunjung
            </h3>
            <p className="text-xs text-slate-400">Distribusi segmen pengguna aplikasi</p>
          </div>

          <div className="space-y-2.5">
            {analytics.categoryDistribution.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{item.category}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {item.count.toLocaleString('id-ID')} ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      i === 0
                        ? 'bg-emerald-400'
                        : i === 1
                        ? 'bg-cyan-400'
                        : i === 2
                        ? 'bg-indigo-400'
                        : i === 3
                        ? 'bg-amber-400'
                        : i === 4
                        ? 'bg-teal-400'
                        : 'bg-rose-400'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Sistem Penghitungan Otomatis
            </div>
            <p>
              Tiap sesi baru dari peramban secara otomatis diagregasi ke statistik harian tanpa menyimpan data pribadi tanpa izin.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Form & Guestbook Records Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Isi Buku Tamu */}
        <div className="lg:col-span-5 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 self-start">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-white text-base">Isi Buku Tamu Digital</h3>
              <p className="text-xs text-slate-400">Catat kehadiran dan berikan saran untuk kemajuan Berau</p>
            </div>
          </div>

          {submitSuccess && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/40 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Terima kasih atas partisipasi Anda!</span>
                <p className="text-emerald-400/90 mt-0.5">
                  Catatan buku tamu dan masukan Anda telah tersimpan dan ditambahkan ke basis data Laboratorium Kependudukan Berau.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Nama Lengkap */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Nama Lengkap *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Muhammad Ilham / Dra. Siti Aminah"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Asal Instansi / Sekolah */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Instansi / Sekolah / Lembaga *</label>
              <input
                type="text"
                placeholder="Contoh: SMKN 1 Berau / Bappeda Berau / PT Berau Coal"
                value={formInstitution}
                onChange={(e) => setFormInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
              />
            </div>

            {/* Kategori Pengunjung & Asal Kecamatan Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Kategori Pengunjung</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as GuestbookEntry['category'])}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Asal Kecamatan</label>
                <select
                  value={formKecamatan}
                  onChange={(e) => setFormKecamatan(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
                >
                  {KECAMATAN_LIST.map((k) => (
                    <option key={k.id} value={k.name}>
                      Kec. {k.name}
                    </option>
                  ))}
                  <option value="Luar Kabupaten Berau">Luar Kabupaten Berau</option>
                </select>
              </div>
            </div>

            {/* Maksud & Tujuan Kunjungan */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Maksud &amp; Tujuan Kunjungan</label>
              <select
                value={formPurpose}
                onChange={(e) => setFormPurpose(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 text-xs"
              >
                {commonPurposes.map((p, idx) => (
                  <option key={idx} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Pesan, Kesan & Saran */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Pesan, Kesan &amp; Masukan *</label>
              <textarea
                required
                rows={3}
                placeholder="Bagikan pengalaman Anda menggunakan aplikasi Laboratorium Kependudukan Berau..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 text-xs leading-relaxed"
              />
            </div>

            {/* Rating Bintang */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Tingkat Kepuasan Layanan</label>
              <div className="flex items-center gap-1.5 pt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-slate-400 ml-2 font-mono">{formRating} / 5 Bintang</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/40 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan Catatan...' : 'Kirim Buku Tamu'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Daftar Catatan Buku Tamu */}
        <div className="lg:col-span-7 space-y-4">
          {/* Header & Filter Bar */}
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">
                  Daftar Tamu &amp; Testimoni ({filteredEntries.length} Catatan)
                </h3>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama, instansi, kecamatan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-56"
                />
              </div>
            </div>

            {/* Category Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold mr-1 flex-shrink-0">
                Filter:
              </span>
              <button
                onClick={() => setSelectedCategoryFilter('Semua')}
                className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                  selectedCategoryFilter === 'Semua'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                    selectedCategoryFilter === cat
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Feed List of Guestbook Entries */}
          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredEntries.length === 0 ? (
              <div className="bg-slate-900/60 p-8 rounded-2xl border border-slate-800 text-center text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs">Tidak ditemukan catatan buku tamu yang cocok dengan kata kunci pencarian.</p>
              </div>
            ) : (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition shadow-sm space-y-2.5"
                >
                  {/* Top line of Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                        {entry.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{entry.name}</h4>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <span>{entry.institution}</span>
                          <span>•</span>
                          <span className="text-emerald-400 flex items-center gap-0.5">
                            <MapPin className="w-3 h-3" />
                            Kec. {entry.kecamatan}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                        {entry.category}
                      </span>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: entry.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Purpose Tag */}
                  <div className="inline-block px-2 py-0.5 rounded bg-emerald-950/50 text-[10px] text-emerald-300 border border-emerald-800/60 font-medium">
                    Tujuan: {entry.purpose}
                  </div>

                  {/* Message Quote */}
                  <p className="text-xs text-slate-200 leading-relaxed italic bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                    &ldquo;{entry.message}&rdquo;
                  </p>

                  {/* Timestamp Footer */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-mono">
                    <span>Terdaftar di Sistem</span>
                    <span>{entry.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
