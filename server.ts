import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { STRATEGIC_SECTORS } from "./src/data/strategicSectors";
import { KECAMATAN_LIST, BERAU_TOTAL_STATS } from "./src/data/berauDemographics";
import { STUDENT_PROFESSIONS_DATA, ASPIRATION_DISPARITY_DATA, STUDENT_ASPIRATIONS_SURVEY_META } from "./src/data/studentAspirations";
import { INITIAL_GUESTBOOK_ENTRIES, INITIAL_VISITOR_ANALYTICS } from "./src/data/guestbookData";
import { GuestbookEntry, VisitorAnalytics } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store for Guestbook & Visitor Analytics
  let guestbookStore: GuestbookEntry[] = [...INITIAL_GUESTBOOK_ENTRIES];
  let visitorAnalyticsStore: VisitorAnalytics = JSON.parse(JSON.stringify(INITIAL_VISITOR_ANALYTICS));

  // Initialize Gemini API client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // --- API Endpoints ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      app: "Laboratorium Kependudukan Kabupaten Berau",
      timestamp: new Date().toISOString(),
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // Demographics summary endpoint
  app.get("/api/demographics/summary", (_req, res) => {
    res.json({
      success: true,
      stats: BERAU_TOTAL_STATS,
      timestamp: new Date().toISOString(),
    });
  });

  // Kecamatan list endpoint
  app.get("/api/demographics/kecamatan", (_req, res) => {
    res.json({
      success: true,
      data: KECAMATAN_LIST,
    });
  });

  // Strategic sectors list
  app.get("/api/sectors", (_req, res) => {
    res.json({
      success: true,
      sectors: STRATEGIC_SECTORS,
    });
  });

  // Scenario simulation calculation
  app.post("/api/predictive/scenario", (req, res) => {
    try {
      const {
        iknGrowthMultiplier = 1.0,
        automationLevel = 1.0, // 0.8 to 1.3
        localQuotaStrictness = 70, // %
        greenEnergyTransition = 1.0,
      } = req.body || {};

      const baseYears = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
      const results = baseYears.map((year, index) => {
        const yearOffset = index;
        const totalFreshGrads = Math.round(6550 * Math.pow(1.035, yearOffset));

        // Mining impacted by automation and green transition
        const miningFactor = Math.pow(1.03, yearOffset) * (1 / (0.8 + 0.2 * automationLevel));
        const miningJobs = Math.round(2150 * miningFactor);

        // Agriculture & Hilirisasi
        const agriJobs = Math.round(1480 * Math.pow(1.045, yearOffset));

        // Tourism accelerated by green energy & IKN proximity
        const tourismFactor = Math.pow(1.12, yearOffset) * iknGrowthMultiplier;
        const tourismJobs = Math.round(920 * tourismFactor);

        // Logistics directly stimulated by IKN corridor
        const logisticsFactor = Math.pow(1.09, yearOffset) * iknGrowthMultiplier;
        const logisticsJobs = Math.round(620 * logisticsFactor);

        // Forestry & Carbon credit
        const forestryJobs = Math.round(350 * Math.pow(1.11, yearOffset) * greenEnergyTransition);

        // Fisheries & Maritime
        const fisheriesJobs = Math.round(650 * Math.pow(1.055, yearOffset));

        // Digital, Urban & Health
        const digitalJobs = Math.round(750 * Math.pow(1.08, yearOffset));

        const totalProjectedJobs = miningJobs + agriJobs + tourismJobs + logisticsJobs + forestryJobs + fisheriesJobs + digitalJobs;
        const localAbsorptionEstimate = Math.round(totalProjectedJobs * (localQuotaStrictness / 100));

        return {
          year,
          totalFreshGrads,
          totalProjectedJobs,
          localAbsorptionEstimate,
          sectors: {
            mining: miningJobs,
            agriculture: agriJobs,
            tourism: tourismJobs,
            logistics: logisticsJobs,
            forestry: forestryJobs,
            fisheries: fisheriesJobs,
            digital: digitalJobs,
          },
        };
      });

      res.json({
        success: true,
        scenarioParams: { iknGrowthMultiplier, automationLevel, localQuotaStrictness, greenEnergyTransition },
        data: results,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Career prediction endpoint for fresh graduates
  app.post("/api/predictive/career", async (req, res) => {
    try {
      const {
        educationLevel = "S1",
        major = "Teknik Pertambangan",
        skills = [],
        certifications = [],
        preferredKecamatan,
        willingToRemote = true,
      } = req.body || {};

      // Local rule-based evaluation baseline
      let primarySector = STRATEGIC_SECTORS[0].name;
      let secondarySector = STRATEGIC_SECTORS[1].name;
      let matchScore = 75;
      let targetKecamatan = ["Gunung Tabur", "Sambaliung", "Tanjung Redeb"];
      let startingSalaryMin = 5.0;
      let startingSalaryMax = 9.5;
      let recommendedRoles = [
        "Junior Field Specialist",
        "Technical Operations Trainee",
        "Quality & Compliance Officer",
      ];
      let recommendedCertifications = [
        "Sertifikasi BNSP Sesuai Bidang",
        "K3 Umum Disnakertrans",
      ];

      const majorLower = (major || "").toLowerCase();

      if (majorLower.includes("tambang") || majorLower.includes("mesin") || majorLower.includes("alat berat") || majorLower.includes("elektro") || majorLower.includes("geologi")) {
        primarySector = STRATEGIC_SECTORS[0].name;
        secondarySector = STRATEGIC_SECTORS[4].name;
        matchScore = 93;
        targetKecamatan = ["Gunung Tabur", "Sambaliung", "Teluk Bayur", "Segah"];
        startingSalaryMin = 7.0;
        startingSalaryMax = 14.0;
        recommendedRoles = [
          "Junior Mining Engineer / Mine Surveyor",
          "Heavy Equipment Maintenance Specialist",
          "K3 & Environment Safety Officer",
        ];
        recommendedCertifications = [
          "Pengawas Operasional Pertama (POP) Pertambangan",
          "Sertifikasi Ahli K3 Umum Kemenaker",
          "Simper / Lisensi Operasi Tambang",
        ];
      } else if (majorLower.includes("sawit") || majorLower.includes("agri") || majorLower.includes("agro") || majorLower.includes("tanah") || majorLower.includes("kimia")) {
        primarySector = STRATEGIC_SECTORS[1].name;
        secondarySector = STRATEGIC_SECTORS[5].name;
        matchScore = 90;
        targetKecamatan = ["Segah", "Sambaliung", "Biatan", "Tabalar"];
        startingSalaryMin = 5.0;
        startingSalaryMax = 9.0;
        recommendedRoles = [
          "Field Agronomy Assistant Trainee",
          "PKS Mill Process Quality Controller",
          "GIS & Drone Mapping Plantation Surveyor",
        ];
        recommendedCertifications = [
          "ISPO / RSPO Auditor Assistant",
          "Sertifikasi Drone Mapping Pemetaan Kebun",
          "K3 Kimia & Pengendalian Limbah",
        ];
      } else if (majorLower.includes("wisata") || majorLower.includes("hotel") || majorLower.includes("boga") || majorLower.includes("bahasa") || majorLower.includes("komunikasi")) {
        primarySector = STRATEGIC_SECTORS[2].name;
        secondarySector = STRATEGIC_SECTORS[6].name;
        matchScore = 92;
        targetKecamatan = ["Pulau Derawan", "Maratua", "Biduk-Biduk"];
        startingSalaryMin = 4.5;
        startingSalaryMax = 9.0;
        recommendedRoles = [
          "Eco-Resort Guest Relations & Hospitality Officer",
          "Certified Marine & Dive Tour Guide",
          "Digital Marketing & Tourism Content Producer",
        ];
        recommendedCertifications = [
          "PADI / SSI Open Water / Divemaster",
          "Pemandu Wisata Bahari BNSP",
          "TOEFL / Kemampuan Bahasa Inggris Aktif",
        ];
      } else if (majorLower.includes("laut") || majorLower.includes("ikan") || majorLower.includes("akuakultur") || majorLower.includes("nautika")) {
        primarySector = STRATEGIC_SECTORS[3].name;
        secondarySector = STRATEGIC_SECTORS[2].name;
        matchScore = 89;
        targetKecamatan = ["Talisayan", "Batu Putih", "Pulau Derawan", "Biduk-Biduk"];
        startingSalaryMin = 4.5;
        startingSalaryMax = 8.5;
        recommendedRoles = [
          "Aquaculture Hatchery Supervisor",
          "Cold Chain & Fish Quality Assessor",
          "Maritime Fishery Logistics Officer",
        ];
        recommendedCertifications = [
          "HACCP Perikanan / Pengolahan Ikan",
          "Sertifikat Kecakapan Nelayan / ANKAPIN",
          "Budidaya Perairan Ramah Lingkungan",
        ];
      } else if (majorLower.includes("informatika") || majorLower.includes("sistem informasi") || majorLower.includes("komputer") || majorLower.includes("it") || majorLower.includes("software")) {
        primarySector = STRATEGIC_SECTORS[6].name;
        secondarySector = STRATEGIC_SECTORS[4].name;
        matchScore = 91;
        targetKecamatan = ["Tanjung Redeb", "Gunung Tabur", "Sambaliung"];
        startingSalaryMin = 5.0;
        startingSalaryMax = 10.0;
        recommendedRoles = [
          "IT Infrastructure & Network Engineer",
          "Data Analyst & Sistem Informasi Geografis (SIG)",
          "Web & Mobile Application Developer",
        ];
        recommendedCertifications = [
          "CompTIA Network+ / Cisco CCNA",
          "Sertifikasi Data Analytics / SQL / Python",
          "Cloud Practitioner / AWS / GCP",
        ];
      } else if (majorLower.includes("hutan") || majorLower.includes("lingkungan") || majorLower.includes("konservasi") || majorLower.includes("biologi")) {
        primarySector = STRATEGIC_SECTORS[5].name;
        secondarySector = STRATEGIC_SECTORS[0].name;
        matchScore = 88;
        targetKecamatan = ["Kelay", "Segah", "Pulau Derawan"];
        startingSalaryMin = 5.0;
        startingSalaryMax = 9.5;
        recommendedRoles = [
          "Forest Carbon Credit & Biomass Assessor",
          "Biodiversity & Ecological Monitoring Officer",
          "Reclamation & Mine Environmental Specialist",
        ];
        recommendedCertifications = [
          "Verifikator Karbon Hutan Berkelanjutan",
          "Sertifikasi GIS ESRI / QGIS Tingkat Lanjut",
          "Analisis Mengenai Dampak Lingkungan (AMDAL)",
        ];
      } else if (majorLower.includes("sipil") || majorLower.includes("logistik") || majorLower.includes("pelabuhan") || majorLower.includes("transportasi")) {
        primarySector = STRATEGIC_SECTORS[4].name;
        secondarySector = STRATEGIC_SECTORS[0].name;
        matchScore = 89;
        targetKecamatan = ["Tanjung Redeb", "Sambaliung", "Pulau Derawan"];
        startingSalaryMin = 5.0;
        startingSalaryMax = 10.5;
        recommendedRoles = [
          "Port Logistics Coordinator",
          "Civil Infrastructure Site Inspector",
          "Supply Chain & Fleet Distribution Officer",
        ];
        recommendedCertifications = [
          "Sertifikasi Ahli Muda K3 Konstruksi",
          "Supply Chain Management Professional (SCMP)",
          "Kepelabuhanan & Maritim Safety",
        ];
      } else {
        // Business, Economics, Administration, Law, Education
        primarySector = STRATEGIC_SECTORS[6].name;
        secondarySector = STRATEGIC_SECTORS[0].name;
        matchScore = 84;
        targetKecamatan = ["Tanjung Redeb", "Sambaliung", "Teluk Bayur"];
        startingSalaryMin = 4.2;
        startingSalaryMax = 8.5;
        recommendedRoles = [
          "Human Resources & Industrial Relations Officer",
          "Corporate Administration & Compliance Trainee",
          "Finance, Accounting & Tax Specialist",
        ];
        recommendedCertifications = [
          "Brevet Pajak A & B",
          "Sertifikasi Manajemen SDM BNSP",
          "Keahlian Pengadaan Barang/Jasa (LKPP)",
        ];
      }

      // Bonus if skills/certifications match
      if (certifications.length > 0) matchScore = Math.min(99, matchScore + 5);
      if (skills.length > 2) matchScore = Math.min(99, matchScore + 3);

      let aiDetailedAdvice = "";

      // Try calling Gemini 3.8 Flash for rich contextualized analysis
      const ai = getGeminiClient();
      if (ai) {
        try {
          const prompt = `Anda adalah Analis Senior Ketenagakerjaan dan Perencanaan Demografi di Laboratorium Kependudukan Kabupaten Berau, Kalimantan Timur.
Analisis profil lulusan baru (Fresh Graduate) berikut untuk prospek penyerapan tenaga kerja di sektor industri strategis Kabupaten Berau:
- Jenjang Pendidikan: ${educationLevel}
- Jurusan / Bidang Studi: ${major}
- Keahlian Tambahan: ${skills.join(", ") || "Standar jurusan"}
- Sertifikasi yang dimiliki: ${certifications.join(", ") || "Belum ada"}
- Preferensi Kecamatan: ${preferredKecamatan || "Terbuka di seluruh Berau"}
- Bersedia Ditugaskan di Site/Remote: ${willingToRemote ? "Ya" : "Hanya perkotaan"}

Fokuskan pada dinamika riil Kabupaten Berau:
1. Kesempatan pada 7 industri strategis Berau (Tambang Batubara PT Berau Coal/BUMA/PAMA di Gn Tabur/Sambaliung, Sawit di Segah/Biatan, Ekowisata Derawan/Maratua/Biduk-Biduk, Perikanan Talisayan, Hutan Wehea Kelay, Koridor Logistik IKN, Jasa Tanjung Redeb).
2. Perda Penyerapan Tenaga Kerja Lokal Berau 70%.
3. Langkah taktis 6 bulan pertama bagi lulusan baru untuk langsung lolos seleksi industri.

Berikan analisis terstruktur dalam 3-4 paragraf yang padat, aplikatif, dan bernada optimis profesional.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
          });

          if (response.text) {
            aiDetailedAdvice = response.text;
          }
        } catch (geminiError: any) {
          console.warn("Gemini generation failed, using local analytical synthesizer:", geminiError.message);
        }
      }

      if (!aiDetailedAdvice) {
        aiDetailedAdvice = `Berdasarkan pemodelan pasar tenaga kerja Kabupaten Berau 2024-2028, lulusan ${educationLevel} jurusan ${major} memiliki tingkat relevansi ${matchScore}% dengan sektor ${primarySector} dan ${secondarySector}. Kabupaten Berau menerapkan Perda No. 8/2018 tentang Pemberdayaan Tenaga Kerja Lokal (kuota minimal 70%), yang memberikan proteksi dan peluang prioritas bagi alumni ber-KTP Berau.

Kebutuhan tenaga kerja di kawasan industri ${targetKecamatan.join(", ")} diproyeksikan tumbuh rata-rata 6.8% per tahun seiring masuknya hilirisasi dan peran Berau sebagai gerbang maritim utara IKN Nusantara. Untuk memenangkan persaingan rekrutmen, kami menyarankan melengkapi portofolio dengan sertifikasi kompetensi ${recommendedCertifications[0]} dan penguasaan keselamatan kerja (K3).`;
      }

      res.json({
        success: true,
        data: {
          matchScore,
          primarySector,
          secondarySector,
          recommendedRoles,
          suitabilityReason: `Keahlian dalam ${major} sangat dibutuhkan dalam rantai nilai operasional ${primarySector} di Kabupaten Berau dengan tren ekspansi yang solid.`,
          topHiringKecamatan: targetKecamatan,
          estimatedStartingSalary: {
            min: startingSalaryMin,
            max: startingSalaryMax,
            currency: "Juta IDR/bulan (UMK Berau Rp 3,83 Juta)",
          },
          keySkillGaps: [
            "Pemahaman standar K3 dan kepatuhan lingkungan kerja industri Berau",
            "Kecakapan digital / pelaporan data operasional lapangan",
            "Komunikasi teknis lintas divisi",
          ],
          recommendedCertifications,
          targetCompanies: [
            "PT Berau Coal & Kontraktor Mitra",
            "Perusahaan Perkebunan Sawit & Pabrik CPO Terpadu",
            "Industri Resort & Jasa Bahari Terkemuka",
            "BUMDes & Sektor Publik Berau",
          ],
          fiveYearOutlook: "Sangat Prospektif (Peningkatan kebutuhan formasi 15-25% hingga 2028 seiring hilirisasi & koridor IKN)",
          aiDetailedAdvice,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Student Aspirations & Market Sync endpoint
  app.get("/api/aspirations/sync", (_req, res) => {
    res.json({
      success: true,
      meta: STUDENT_ASPIRATIONS_SURVEY_META,
      professions: STUDENT_PROFESSIONS_DATA,
      disparityData: ASPIRATION_DISPARITY_DATA,
    });
  });

  // Student AI Career Roadmap Counseling
  app.post("/api/aspirations/roadmap", async (req, res) => {
    try {
      const {
        professionTitle,
        studentGrade = "Kelas 11 SMA / SMK",
        schoolName = "SMA/SMK di Berau",
        originKecamatan = "Tanjung Redeb",
        specificInterest = "",
      } = req.body || {};

      let roadmapText = "";
      const ai = getGeminiClient();

      if (ai) {
        try {
          const prompt = `Anda adalah Guru BK Teladan dan Konsultan Karir Daerah di Laboratorium Kependudukan Kabupaten Berau, Kalimantan Timur.
Seorang siswa asal Kabupaten Berau dengan profil berikut ingin mencapai cita-citanya:
- Asal Sekolah: ${schoolName} (Kecamatan ${originKecamatan}, Kab. Berau)
- Tingkat/Jenjang: ${studentGrade}
- Cita-cita / Profesi Impian: ${professionTitle}
- Catatan / Minat Khusus: ${specificInterest || "Ingin berkarir di Berau dan mandiri secara ekonomi"}

Buatkan panduan dan presentasi roadmap terstruktur untuk siswa tersebut:
1. PRESENTASI PELUANG NYATA DI KABUPATEN BERAU: Jelaskan realitas pasar kerja Berau (kebutuhan industri batubara, perkebunan kelapa sawit, wisata bahari Derawan/Maratua, logistik maritim penyangga IKN, atau sektor publik), serta persentase peluang penyerapannya.
2. LANGKAH SEMASA SEKOLAH (Kelas 10-12): Mata pelajaran fokus, ekstrakurikuler, dan keterampilan dasar yang harus dilatih sejak dini.
3. JALUR PENDIDIKAN & BEASISWA: Rekomendasi perguruan tinggi / politeknik vokasi rujukan di Berau atau Kalimantan Timur (misal Poltek Berau, Unmul Samarinda, Poltekkes, dll.) serta peluang beasiswa (Beasiswa Berau Cerdas / CSR Berau Coal).
4. STRATEGI MEMANFAATKAN PERDA 70% NAKER LOKAL: Sertifikasi kompetensi (BNSP, K3, PADI, dll.) yang membuat siswa langsung diprioritaskan oleh perusahaan di Berau.

Gunakan bahasa Indonesia yang menginspirasi, ramah bagi pelajar SMA/SMK, namun berbasis data praktis industri Berau.`;

          const response = await ai.models.generateContent({
            model: "gemini-3.8-flash",
            contents: prompt,
          });

          if (response.text) {
            roadmapText = response.text;
          }
        } catch (err: any) {
          console.warn("AI generation failed for student roadmap:", err.message);
        }
      }

      if (!roadmapText) {
        roadmapText = `### Roadmap Meraih Cita-cita: ${professionTitle} di Kabupaten Berau

1. **Presentasi Peluang Karir di Berau:**
Profesi ${professionTitle} memiliki keterkaitan erat dengan struktur ekonomi Kabupaten Berau. Pemerintah Daerah melalui Perda No. 8/2018 menjamin kuota 70% tenaga kerja lokal bagi putra-putri ber-KTP Berau, memberikan keunggulan kompetitif yang kuat bagi lulusan sekolah lokal.

2. **Langkah Semasa Sekolah (${studentGrade}):**
- Perkuat nilai akademik pada mata pelajaran penunjang kejuruan.
- Ikuti pelatihan kejuruan tambahan di sekolah dan kegiatan kepemimpinan (OSIS / Pramuka / Ekskul).
- Asah keterampilan komunikasi dan bahasa Inggris aktif untuk menghadapi seleksi industri multinasional di Berau.

3. **Jalur Pendidikan & Vokasi Rujukan:**
- Manfaatkan perguruan tinggi daerah seperti Politeknik Sinar Mas Berau Coal, STIE Muhammadiyah Berau, atau Universitas Mulawarman Samarinda.
- Pantau pembukaan program Beasiswa Berau Cerdas dari Pemkab Berau dan program beasiswa pendidikan berkelanjutan dari perusahaan mitra industri.

4. **Sertifikasi Kunci & Portofolio:**
Pastikan sebelum atau sesaat setelah lulus mengantongi sertifikasi kompetensi profesi terkait (BNSP / Sertifikat K3) agar berkas Anda berada di prioritas teratas rekrutmen.`;
      }

      res.json({
        success: true,
        roadmap: roadmapText,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Guestbook: GET all entries
  app.get("/api/guestbook", (_req, res) => {
    res.json({
      success: true,
      totalEntries: guestbookStore.length,
      entries: guestbookStore,
    });
  });

  // Guestbook: POST new entry
  app.post("/api/guestbook", (req, res) => {
    try {
      const { name, institution, category, kecamatan, purpose, message, rating } = req.body || {};

      if (!name || !message) {
        return res.status(400).json({ success: false, error: "Nama dan pesan wajib diisi." });
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newEntry: GuestbookEntry = {
        id: `gb-${Date.now()}`,
        name: String(name).trim(),
        institution: institution ? String(institution).trim() : "Masyarakat Umum",
        category: category || "Masyarakat Umum",
        kecamatan: kecamatan || "Tanjung Redeb",
        purpose: purpose || "Kunjungan & Informasi Umum",
        message: String(message).trim(),
        rating: typeof rating === "number" ? Math.min(5, Math.max(1, rating)) : 5,
        createdAt: `${dateStr}, ${timeStr}`,
        dateISO: now.toISOString().split("T")[0],
      };

      // Add to beginning
      guestbookStore.unshift(newEntry);

      // Increment visitor counter today
      visitorAnalyticsStore.todayCount += 1;
      visitorAnalyticsStore.totalAllTime += 1;

      // Update today's recentDays record
      if (visitorAnalyticsStore.recentDays.length > 0) {
        const lastIdx = visitorAnalyticsStore.recentDays.length - 1;
        visitorAnalyticsStore.recentDays[lastIdx].count += 1;
      }

      // Update category distribution
      const catMatch = visitorAnalyticsStore.categoryDistribution.find(
        (c) => c.category === newEntry.category
      );
      if (catMatch) {
        catMatch.count += 1;
      }

      res.status(201).json({
        success: true,
        entry: newEntry,
        message: "Terima kasih, catatan buku tamu Anda berhasil disimpan di Laboratorium Kependudukan Berau!",
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Daily Visitor Analytics: GET stats
  app.get("/api/visitors/stats", (_req, res) => {
    res.json({
      success: true,
      analytics: visitorAnalyticsStore,
    });
  });

  // Daily Visitor: Record a visit (heartbeat / new session)
  app.post("/api/visitors/record", (_req, res) => {
    visitorAnalyticsStore.todayCount += 1;
    visitorAnalyticsStore.totalAllTime += 1;

    if (visitorAnalyticsStore.recentDays.length > 0) {
      const lastIdx = visitorAnalyticsStore.recentDays.length - 1;
      visitorAnalyticsStore.recentDays[lastIdx].count += 1;
    }

    res.json({
      success: true,
      todayCount: visitorAnalyticsStore.todayCount,
      totalAllTime: visitorAnalyticsStore.totalAllTime,
    });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Laboratorium Kependudukan Berau Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
