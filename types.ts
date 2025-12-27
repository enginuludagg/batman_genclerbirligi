
export interface Badge {
  id: string;
  name: string;
  type: 'success' | 'warning' | 'info' | 'danger';
  icon: string;
  date: string;
}

export interface ScoutingNote {
  id: string;
  content: string;
  date: string;
  potential: number; // 1-5
  scoutName: string;
}

export interface Student {
  id: string;
  name: string;
  photoUrl?: string;
  age: number;
  birthYear?: number;
  jerseyNumber?: number;
  gender: 'Erkek' | 'Kız';
  parentPhone?: string;
  parentName?: string;
  parentEmail?: string; 
  password?: string;    
  parentJob?: string;
  schoolName?: string;
  schoolGrade?: string;
  bloodType?: string;
  sport: 'Futbol' | 'Voleybol' | 'Cimnastik'; // Ana branş
  activeSports: ('Futbol' | 'Voleybol' | 'Cimnastik')[]; // Kayıtlı olduğu tüm branşlar
  branchId: string; // Grup (U12 vb)
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
  badges: Badge[];
  scoutingNotes: ScoutingNote[];
}

export interface Trainer {
  id: string;
  name: string;
  photoUrl?: string;
  specialty: string;
  phone: string;
  groups: string[];
  biography?: string; // Özgeçmiş alanı eklendi
}

export interface MediaPost {
  id: string;
  title: string;
  type: 'bulletin' | 'gallery' | 'poll' | 'lineup';
  content: string;
  date: string;
  status: 'pending' | 'published';
  imageUrl?: string;
  likes?: number;
  pollOptions?: string[];
  lineupData?: {
    sport: 'Futbol' | 'Voleybol';
    mode: string;
    players: { pos: string; name: string; photo?: string; number?: number }[];
    subs: { name: string; photo?: string; number?: number }[];
  };
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

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  category: 'Aidat' | 'Ekipman' | 'Kira' | 'Maaş' | 'Diğer';
  amount: number;
  date: string;
  description: string;
  branch: string;
  paymentMethod: string;
  studentId?: string; // Sporcu eşleştirme
  studentName?: string; // Hızlı görünüm için
}

export interface Notification {
  title: string;
  message: string;
}

export interface TrainerNote {
  id: string;
  trainerName: string;
  content: string;
  date: string;
  status: 'new' | 'read';
  priority: 'low' | 'medium' | 'high';
  category: 'Saha Dışı' | 'Malzeme' | 'Disiplin' | 'Gelişim';
  targetScope: string;
}

export interface LeagueTeam {
  name: string;
  played: number;
  points: number;
  isUserTeam?: boolean;
}

export interface MatchResult {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  location: string;
  category: string;
  status: 'scheduled' | 'completed';
}

export type ViewType = 'dashboard' | 'students' | 'trainers' | 'schedule' | 'attendance' | 'finance' | 'media' | 'league' | 'ai-coach' | 'analytics' | 'drills' | 'settings' | 'notes' | 'about';
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
  notifications: Notification[];
  trainerNotes: TrainerNote[];
}
