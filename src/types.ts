export interface KecamatanData {
  id: string;
  name: string;
  capital: string;
  population: number;
  areaKm2: number;
  density: number;
  malePop: number;
  femalePop: number;
  sexRatio: number;
  productiveAgePop: number; // 15-64 years
  productivePercentage: number;
  freshGraduatesPerYear: {
    smaSmk: number;
    diploma: number;
    sarjana: number;
    total: number;
  };
  unemploymentRate: number; // TPT %
  laborAbsorptionIndex: number; // 1-100
  primaryIndustries: string[];
  keyEmployers: string[];
  coordinates: { lat: number; lng: number };
  svgPath: string;
  labelPos: { x: number; y: number };
  description: string;
  economicPillars: {
    sector: string;
    sharePercent: number;
  }[];
  demographicTrend: {
    year: number;
    population: number;
    freshGrads: number;
  }[];
}

export interface StrategicSector {
  id: string;
  name: string;
  code: string;
  icon: string;
  description: string;
  currentWorkforce: number;
  projectedDemand2025: number;
  projectedDemand2028: number;
  growthRateAnnual: number;
  topRoles: string[];
  requiredMajors: string[];
  freshGradStartingSalary: {
    min: number; // IDR in millions
    max: number;
  };
  keyEmployers: string[];
  primaryKecamatan: string[];
  localContentTarget: number; // % Perda Naker Lokal target
  automationRisk: 'Rendah' | 'Sedang' | 'Tinggi';
}

export interface StudentProfessionAspiration {
  id: string;
  professionTitle: string;
  category:
    | 'Tambang & Energi'
    | 'Kesehatan & Medis'
    | 'Pariwisata & Bahari'
    | 'Teknologi & Digital'
    | 'Pertanian & Sawit'
    | 'Kemaritiman & Logistik'
    | 'Pemerintahan & Hukum'
    | 'Bisnis & Kreatif'
    | 'Pendidikan'
    | 'Konservasi Lingkungan';
  studentInterestPercent: number; // % of students aiming for this (e.g. 14.5%)
  studentCountSurveyd: number; // estimated students count
  berauMarketDemandAnnual: number; // actual job vacancies per year in Berau
  absorptionOpportunityPercent: number; // PRESENTASE PELUANG PENYERAPAN KERJA (e.g. 94%)
  opportunityStatus: 'Sangat Tinggi' | 'Tinggi' | 'Moderat' | 'Kompetitif' | 'Sangat Ketat';
  primaryTargetSectors: string[];
  hiringKecamatan: string[];
  educationPathways: string[]; // local schools & universities
  keyCertificationsNeeded: string[];
  estimatedStartingSalary: { min: number; max: number };
  majorEmployersInBerau: string[];
  opportunityAnalysis: string;
  gapAnalysis: string;
  iconName: string;
}

export interface DemographicEvent {
  id: string;
  timestamp: string;
  type: 'birth' | 'death' | 'in_migration' | 'out_migration' | 'graduation' | 'job_hired';
  kecamatan: string;
  description: string;
  impact: number;
}

export interface CareerPredictionRequest {
  educationLevel: 'SMK' | 'D3/D4' | 'S1';
  major: string;
  skills: string[];
  certifications: string[];
  preferredKecamatan?: string;
  willingToRemote: boolean;
  minExpectedSalary?: number;
}

export interface CareerPredictionResult {
  matchScore: number;
  primarySector: string;
  secondarySector: string;
  recommendedRoles: string[];
  suitabilityReason: string;
  topHiringKecamatan: string[];
  estimatedStartingSalary: {
    min: number;
    max: number;
    currency: string;
  };
  keySkillGaps: string[];
  recommendedCertifications: string[];
  targetCompanies: string[];
  fiveYearOutlook: string;
  aiDetailedAdvice?: string;
}

export type MapViewLayer = 'density' | 'fresh_grads' | 'industries' | 'absorption' | 'tourism';

export interface GuestbookEntry {
  id: string;
  name: string;
  institution: string;
  category:
    | 'Pelajar / Mahasiswa'
    | 'Guru / Tenaga Pendidik'
    | 'Instansi Pemerintah / ASN'
    | 'Industri / Swasta'
    | 'Peneliti / Akademisi'
    | 'Masyarakat Umum';
  kecamatan: string;
  purpose: string;
  message: string;
  rating: number; // 1-5
  createdAt: string;
  dateISO: string;
}

export interface DailyVisitorRecord {
  date: string;
  dayName: string;
  count: number;
}

export interface VisitorAnalytics {
  todayCount: number;
  yesterdayCount: number;
  thisWeekCount: number;
  totalAllTime: number;
  dailyAverage: number;
  recentDays: DailyVisitorRecord[];
  categoryDistribution: { category: string; count: number; percentage: number }[];
  kecamatanDistribution: { name: string; count: number }[];
}
