
export interface Student {
  id: string;
  name: string;
  photoUrl?: string;
  age: number;
  birthYear?: number;
  parentPhone?: string;
  parentName?: string;
  parentEmail?: string; // Giriş için eklendi
  password?: string;    // Giriş için eklendi
  parentJob?: string;
  schoolName?: string;
  schoolGrade?: string;
  bloodType?: string;
  sport: 'Futbol' | 'Voleybol'; 
  branchId: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  status: 'active' | 'passive';
  attendance: number; 
  lastTraining: string;
  stats: { strength: number; speed: number; stamina: number; technique: number; };
  physicalStats?: {
    speed20m: number;
    height: number;
    weight: number;
    sitUps: number;
    pushUps: number;
    sitAndReach: number;
    thighLength: number;
    run1500m: string;
  };
  feeStatus: 'Paid' | 'Pending' | 'Overdue';
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  category: 'Aidat' | 'Ekipman' | 'Kira' | 'Maaş' | 'Diğer';
  amount: number;
  date: string;
  description: string;
  branch: string;
  paymentMethod: 'Elden' | 'Banka' | 'Kredi Kartı';
}

export interface MediaPost {
  id: string;
  title: string;
  type: 'bulletin' | 'gallery' | 'poll';
  content: string;
  date: string;
  status: 'pending' | 'published';
  imageUrl?: string;
  likes?: number;
  pollOptions?: string[];
}

export interface Trainer {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  groups: string[];
}

export interface TrainingSession {
  id: string;
  title: string;
  group: string;
  time: string;
  day: string;
  location: string;
}

export interface Drill {
  id: string;
  title: string;
  category: 'Teknik' | 'Kondisyon' | 'Taktik' | 'Eğlenceli Oyun';
  difficulty: 1 | 2 | 3 | 4 | 5;
  duration: string;
  equipment: string[];
  description: string;
  imageUrl?: string;
}

export interface Notification {
  title: string;
  message: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export type ViewType = 'dashboard' | 'students' | 'trainers' | 'schedule' | 'attendance' | 'finance' | 'media' | 'league' | 'ai-coach' | 'analytics' | 'drills';
export type AppMode = 'admin' | 'parent';

export interface AppContextData {
  students: Student[];
  trainers: Trainer[];
  branches: any[];
  sessions: TrainingSession[];
  finance: FinanceEntry[];
  media: MediaPost[];
  drills: Drill[];
  attendance: any[];
  notifications: any[];
}

export interface LeagueTeam {
  rank: number;
  name: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number;
  ga: number;
  gd: number;
  points: number;
  form: string[];
  isUserTeam?: boolean;
}

export interface MatchResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: string;
  status: 'played' | 'scheduled';
}
