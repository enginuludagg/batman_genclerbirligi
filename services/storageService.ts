
import { Student, Trainer, TrainerNote, TrainingSession, FinanceEntry, MediaPost, Drill } from '../types';

/**
 * Batman Gençlerbirliği (BGB) Veri Saklama Servisi
 * Çoklu telefon erişimi (Anne/Baba) desteği için optimize edilmiştir.
 */

const KEYS = {
  STUDENTS: 'bgb_students',
  TRAINERS: 'bgb_trainers',
  NOTES: 'bgb_notes',
  SESSIONS: 'bgb_sessions',
  FINANCE: 'bgb_finance',
  MEDIA: 'bgb_media',
  DRILLS: 'bgb_drills',
  DEVICE_ID: 'bgb_device_id'
};

export const storageService = {
  // Her cihaz için benzersiz bir kimlik oluşturur (Bulut senkronizasyonu için)
  getDeviceId: () => {
    let id = localStorage.getItem(KEYS.DEVICE_ID);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(KEYS.DEVICE_ID, id);
    }
    return id;
  },

  save: (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('BGB Storage Error:', e);
      return false;
    }
  },

  load: <T>(key: string, defaultValue: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  },

  // Sistemi tamamen sıfırlamak için (Temiz kurulum)
  clearAllData: () => {
    Object.values(KEYS).forEach(key => {
      if (key !== KEYS.DEVICE_ID) { // Cihaz ID'sini koruyalım, verileri silelim
        localStorage.removeItem(key);
      }
    });
    // Sayfayı yenileyerek state'leri sıfırla
    window.location.reload();
  },

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
