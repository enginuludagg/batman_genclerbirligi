
import { Student, Trainer, TrainerNote, TrainingSession, FinanceEntry, MediaPost, Drill } from '../types';

const KEYS = {
  STUDENTS: 'bgb_students',
  TRAINERS: 'bgb_trainers',
  NOTES: 'bgb_notes',
  SESSIONS: 'bgb_sessions',
  FINANCE: 'bgb_finance',
  MEDIA: 'bgb_media',
  DRILLS: 'bgb_drills',
};

export const storageService = {
  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage Error:', e);
      return false;
    }
  },

  load: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  },

  // Yarın Firebase'e geçmek için bu fonksiyonların içini değiştirmemiz yetecek
  syncAll: (data: {
    students: Student[];
    trainers: Trainer[];
    notes: TrainerNote[];
    sessions: TrainingSession[];
    finance: FinanceEntry[];
    media: MediaPost[];
    drills: Drill[];
  }) => {
    storageService.save(KEYS.STUDENTS, data.students);
    storageService.save(KEYS.TRAINERS, data.trainers);
    storageService.save(KEYS.NOTES, data.notes);
    storageService.save(KEYS.SESSIONS, data.sessions);
    storageService.save(KEYS.FINANCE, data.finance);
    storageService.save(KEYS.MEDIA, data.media);
    storageService.save(KEYS.DRILLS, data.drills);
  }
};

export { KEYS };
