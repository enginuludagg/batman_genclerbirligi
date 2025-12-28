
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
     if (lower.includes('merhaba')) return { text: "Merhaba! BGB Akademi asistanınız hizmetinizde." };
     if (lower.includes('iletişim') || lower.includes('adres')) return { text: "Kulübümüze 0505 340 11 01 numarasından ulaşabilirsiniz." };
     return { text: FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] };
  }

  const ai = getAIClient();
  
  // --- DİNAMİK CONTEXT HAZIRLAMA ---
  let userRoleDescription = "";
  const today = new Date().toLocaleDateString('tr-TR');

  // Ortak veriler
  const scheduleText = context.sessions.map(s => `- ${s.day} ${s.time}: ${s.group} (${s.location})`).join('\n');
  const upcomingMatches = context.fixtures
    .filter(f => f.status === 'scheduled')
    .map(f => `- ${f.date} ${f.time}: ${f.homeTeam} vs ${f.awayTeam} (${f.category})`)
    .join('\n');

  let specializedData = "";

  if (mode === 'admin') {
    userRoleDescription = "Kullanıcı: KULÜP YÖNETİCİSİ (Hoca/Admin). Her türlü veriyi görme yetkisi var.";
    const studentCount = context.students.length;
    const balance = context.finance.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
    
    specializedData = `
      YÖNETİCİ ÖZEL VERİLERİ:
      - Toplam Sporcu: ${studentCount}
      - Kasa Bakiyesi: ${balance} TL
      - Antrenör Notları: ${context.trainerNotes.length} adet rapor var.
    `;

  } else if (mode === 'parent' && currentStudent) {
    userRoleDescription = `Kullanıcı: SPORCU VELİSİ.
    Velisi olduğu öğrenci: ${currentStudent.name}.
    DİKKAT: Sadece bu öğrencinin verilerini paylaşabilirsin. Başka öğrenci, finans veya antrenör notlarını ASLA paylaşma.`;

    const s = currentStudent;
    specializedData = `
      ÖĞRENCİ DETAYLARI (${s.name}):
      - Grup: ${s.branchId} | Branş: ${s.sport}
      - Durum: ${s.status === 'active' ? 'Aktif' : 'Pasif'}
      - Devamlılık: %${s.attendance}
      - Son Antrenman: ${s.lastTraining}
      - Aidat Durumu: ${s.feeStatus === 'Paid' ? 'Ödendi' : 'Ödeme Bekliyor'}
      - Fiziksel: Hız ${s.stats.speed}, Güç ${s.stats.strength}
    `;
  }

  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      config: {
        temperature: 0.2, // Yaratıcılığı düşürdük, daha gerçekçi olsun
        systemInstruction: `
        Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün yapay zeka asistanısın.
        
        KİMLİĞİN VE KESİN SINIRLARIN (BUNLARA UYMAK ZORUNDASIN):
        1. Sen SADECE bir sohbet botusun. Veritabanına YAZMA, GÜNCELLEME, SİLME yetkin YOK.
        2. ASLA "Programı güncelledim", "Yeni drill ekledim", "Listeyi düzenledim" gibi yalan beyanlarda bulunma.
        3. Kullanıcı senden bir işlem yapmanı isterse (örneğin: "Ahmet'i kaydet", "Maç ekle"), nazikçe "Ben sadece bilgi verebilirim, bu işlemi yapmak için lütfen ilgili menüyü kullanın" de.
        4. "TFF kaynaklarından veri çektim", "Uluslararası veritabanından güncelledim" gibi uydurma cümleler kurma. Sadece sana aşağıda verilen verileri kullan.

        MEVCUT KULÜP BİLGİLERİ:
        ${CLUB_INFO}
        
        GÜNCEL HAFTALIK PROGRAM:
        ${scheduleText || 'Program bilgisi henüz girilmemiş.'}

        FİKSTÜR / MAÇLAR:
        ${upcomingMatches || 'Planlanmış maç yok.'}

        ${specializedData}

        TARİH: ${today}

        CEVAP TARZI:
        - Kısa, net ve profesyonel ol.
        - Kullanıcı işlem istediğinde "Bunu yapmak için sol menüden [İlgili Menü] sekmesini kullanabilirsiniz" de.
        - Bilmediğin bir veri sorulursa "Sistemde bu bilgi kayıtlı değil" de.
        `
      }
    });
    return { text: res.text || "Anlaşıldı." };
  } catch (e) {
    console.error("AI Error:", e);
    return { text: "Bağlantıda bir sorun var. Lütfen tekrar deneyin." };
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
