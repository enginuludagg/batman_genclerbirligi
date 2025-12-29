
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

// --- SABİT KULÜP BİLGİLERİ (Knowledge Base) ---
const CLUB_INFO = `
  KULÜP KİMLİĞİ:
  - İsim: Batman Gençlerbirliği (BGB) Spor Kulübü ve Akademisi
  - Kurucu ve Teknik Direktör: Engin Uludağ (TFF C, TVF 2. Kademe, TCF 2. Kademe Antrenör)
  - İletişim: 0505 340 11 01
  - Konum: Batman Merkez, BGB Tesisleri (Gültepe Mah.)
  - Vizyon: "İyi birey, iyi vatandaş, iyi sporcu."
  - Branşlar: Futbol, Voleybol, Cimnastik
  - Yaş Grupları: U10, U11, U12, U13, U14, U15, U16, U17, U18, U19, Minikler.
  - Renkler: Kırmızı - Siyah
`;

// --- VARSAYILAN CEVAPLAR (Offline Modu) ---
const FALLBACK_RESPONSES = [
  "Şu an sunucularımıza erişimde kısa süreli bir yoğunluk var. Ancak Engin Hoca'ya 0505 340 11 01 numarasından ulaşabilirsiniz.",
  "Merhaba! Ben BGB Asistanı. Antrenman saatleri, çocukların durumu veya kulüp hakkında bilgi verebilirim.",
  "Verilerinizi şu an çekemiyorum ama genel kulüp işleyişi hakkında sorunuz varsa yanıtlayabilirim."
];

export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      id: `auto-${Date.now()}`,
      title: `${sport} Temel Çalışma`,
      category: 'Teknik',
      difficulty: 2,
      duration: '15 Dakika',
      equipment: ['Top', 'Huni'],
      description: "API Anahtarı girilmediği için varsayılan drill gösteriliyor. Lütfen API Key tanımlayın.",
      ageGroup: 'U12'
    };
  }

  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${sport} için U12 seviyesinde, TFF/TVF standartlarına uygun, yaratıcı ve detaylı bir antrenman drilli oluştur.` }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.INTEGER },
            duration: { type: Type.STRING },
            ageGroup: { type: Type.STRING },
            equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI Boş Cevap Döndü");
    return { ...JSON.parse(text), id: `ai-${Date.now()}` };
  } catch (e) {
    console.error("Drill Gen Error:", e);
    return {
      id: `err-${Date.now()}`,
      title: "Pas ve Destek",
      category: 'Teknik',
      difficulty: 1,
      duration: '10 Dakika',
      equipment: ['Top'],
      description: "Yapay zeka servisine ulaşılamadı. Klasik pas çalışması yapabilirsiniz.",
      ageGroup: 'Genel'
    };
  }
};

export const getAICoachResponse = async (userInput: string, context: AppContextData, mode: AppMode, currentStudent?: Student | null) => {
  if (!process.env.API_KEY) {
     const lower = userInput.toLowerCase();
     if (lower.includes('merhaba')) return { text: "Merhaba! BGB Akademi asistanınız hizmetinizde. API Anahtarı eksik olduğu için kısıtlı moddayım." };
     return { text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] };
  }

  const ai = getAIClient();
  
  // --- DİNAMİK CONTEXT HAZIRLAMA ---
  const today = new Date().toLocaleDateString('tr-TR');

  // Ortak veriler
  const scheduleText = context.sessions.map(s => `- ${s.day} ${s.time}: ${s.group} (${s.location})`).join('\n');
  const upcomingMatches = context.fixtures
    .filter(f => f.status === 'scheduled')
    .map(f => `- ${f.date} ${f.time}: ${f.homeTeam} vs ${f.awayTeam} (${f.category})`)
    .join('\n');

  let specializedData = "";

  if (mode === 'admin') {
    const studentCount = context.students.length;
    const balance = context.finance.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
    const activeStudents = context.students.filter(s => s.status === 'active').length;
    
    specializedData = `
      YÖNETİCİ ÖZEL ANALİZ VERİLERİ (Bunu kullanıcıya sunarken doğal bir dille anlat):
      - Toplam Kayıtlı Sporcu: ${studentCount} (Aktif: ${activeStudents})
      - Güncel Kasa Bakiyesi: ${balance} TL
      - Son Eklenen Notlar: ${context.trainerNotes.slice(0, 3).map(n => n.content).join(' | ')}
    `;

  } else if (mode === 'parent' && currentStudent) {
    const s = currentStudent;
    specializedData = `
      VELİ ÖZEL VERİLERİ (Sadece bu öğrenci hakkında konuş):
      - Öğrenci: ${s.name}
      - Grup: ${s.branchId} | Branş: ${s.sport}
      - Devamlılık: %${s.attendance}
      - Aidat Durumu: ${s.feeStatus === 'Paid' ? 'Ödendi' : 'Ödeme Bekliyor'}
      - Kayıt Tarihi: ${s.registrationDate || 'Bilinmiyor'}
      - Fiziksel Gelişim: Hız ${s.stats.speed}, Güç ${s.stats.strength}
    `;
  }

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      config: {
        temperature: 0.7, // Yaratıcılığı artırdık, daha az robotik olması için
        systemInstruction: `
        Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün yapay zeka baş antrenör yardımcısısın. Adın BGB Asistan.
        Engin Uludağ Hoca'nın sağ kolusun.
        
        GÖREVİN:
        Sana verilen aşağıdaki verileri kullanarak kullanıcıyla sohbet et, sorularını yanıtla ve analiz yap.
        Robot gibi değil, tecrübeli bir spor adamı gibi konuş.
        
        VERİLER:
        ${CLUB_INFO}
        
        HAFTALIK PROGRAM:
        ${scheduleText || 'Program bilgisi henüz girilmemiş.'}

        MAÇLAR:
        ${upcomingMatches || 'Yakın zamanda planlanmış maç yok.'}

        ÖZEL VERİLER (Kullanıcının yetkisine göre):
        ${specializedData}

        TARİH: ${today}

        KURALLAR:
        1. Asla veritabanını güncellediğini söyleme (okuma yetkin var, yazma yetkin yok).
        2. Eğer kullanıcı bir işlem yapmak isterse (örn: "Öğrenci ekle"), ona menüden nasıl yapacağını tarif et.
        3. Sorulan soruya elindeki verilerle cevap veremiyorsan dürüstçe "Sistemde bu bilgi henüz yok" de.
        4. Cevapların kısa, net ve motive edici olsun.
        `
      }
    });
    return { text: res.text || "Anlaşıldı hocam." };
  } catch (e) {
    console.error("AI Error:", e);
    return { text: "Bağlantıda küçük bir kopukluk oldu. Tekrar dener misiniz?" };
  }
};

export const getCoachSuggestions = async (student: Student) => {
  if (!process.env.API_KEY) return "Gelişimi olumlu yönde devam ediyor. Antrenmanlara düzenli katılımı önemli.";
  
  const ai = getAIClient();
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Bu sporcu için kısa (2 cümle), motive edici bir gelişim raporu yaz. Veriler: ${student.sport}, Yaş: ${student.age}, Güç: ${student.stats.strength}, Teknik: ${student.stats.technique}` }] }]
    });
    return res.text || "Sporcumuzun gelişimi devam ediyor.";
  } catch {
    return "Sporcumuzun gelişimi devam ediyor.";
  }
};

export const getDrillAITips = async (drill: Drill) => {
  if (!process.env.API_KEY) return "Bu drilli uygularken oyuncuların sürekli hareket halinde olmasına dikkat edin.";
  
  const ai = getAIClient();
  try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `Futbol/Voleybol antrenörü olarak bu drill için tek cümlelik, can alıcı bir ipucu ver: ${drill.title} - ${drill.description}` }] }]
      });
      return res.text || "Tempoyu yüksek tutun.";
  } catch(e) { return "Dikkatli uygulayın."; }
};
