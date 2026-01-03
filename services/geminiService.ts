import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

// TypeScript'in process nesnesini tanıması için deklarasyon
declare var process: any;

/**
 * API KEY Okuma
 */
const getAIClient = () => {
  try {
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
      console.warn("API Key bulunamadı. Lütfen .env dosyasında VITE_GEMINI_API_KEY tanımlı olduğundan emin olun.");
      return null;
    }
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("AI Client başlatılamadı:", e);
    return null;
  }
};

/**
 * BGB AKADEMİ SABİT BİLGİ HAVUZU (AI yoksa fallback)
 */
const BGB_KNOWLEDGE_BASE = {
  responses: [
    "Antrenman planı yaş grubuna uygun şekilde hazırlanmalıdır.",
    "Teknik gelişim için tekrar sayısı artırılabilir.",
    "Oyunla eğitim prensibi uygulanmalıdır."
  ]
};

/**
 * GÜVENLİ VERİ HAZIRLAYICI
 * Finansal verileri ve hassas bilgileri temizler, sadece genel bilgileri AI'a verir.
 */
const prepareSafeContext = (context: AppContextData) => {
  return {
    kulupAdi: "Batman Gençlerbirliği Spor Okulu (BGB)",
    antrenmanProgrami: context.sessions.map(s => ({
      gun: s.day,
      saat: s.time,
      grup: s.group,
      yer: s.location
    })),
    antrenorler: context.trainers.map(t => ({
      isim: t.name,
      uzmanlik: t.specialty,
      sorumluOlduguGruplar: t.groups
    })),
    siradakiMaclar: context.fixtures.filter(f => f.status === 'scheduled').map(f => ({
      rakip: f.awayTeam,
      tarih: f.date,
      saat: f.time,
      kategori: f.category
    })),
    sonDuyurular: context.media.filter(m => m.status === 'published').slice(0, 5).map(m => ({
      baslik: m.title,
      icerik: m.content
    })),
    // NOT: context.finance (Finansal Veriler) BURAYA EKLENMEDİ. AI BUNLARI GÖREMEZ.
  };
};

/**
 * AI KOÇ YANITI
 */
export const getAICoachResponse = async (
  userInput: string,
  context: AppContextData,
  mode: AppMode,
  currentStudent?: Student | null
): Promise<{ text: string; sources: string[] }> => {
  const ai = getAIClient();
  if (!ai) {
    return {
      text: BGB_KNOWLEDGE_BASE.responses[
        Math.floor(Math.random() * BGB_KNOWLEDGE_BASE.responses.length)
      ],
      sources: []
    };
  }

  // 1. Güvenli veriyi hazırla
  const clubData = prepareSafeContext(context);
  const studentContext = currentStudent ? `Kullanıcı Bilgisi: Öğrenci Adı: ${currentStudent.name}, Grubu: ${currentStudent.branchId}` : "Kullanıcı: Misafir/Yönetici";

  // 2. Sistem Talimatı (System Prompt)
  // Burada AI'a sadece kulüp verisini kullanmasını ve ticari sırları saklamasını emrediyoruz.
  const systemPrompt = `
    ROL: Sen Batman Gençlerbirliği Spor Okulu'nun (BGB Akademi) yapay zeka asistanısın.
    
    GÖREV: Aşağıdaki "KULÜP VERİLERİ"ni referans alarak kullanıcının sorusunu cevapla.
    
    KESİN KURALLAR:
    1. SADECE VERİLEN VERİYİ KULLAN: Google araması yapma, genel internet bilgisi verme (Örn: "Messi kimdir?" sorusuna "Sadece kulüp hakkında bilgi verebilirim" de).
    2. GİZLİLİK: Maaşlar, aidat gelirleri, kulüp kasası gibi TİCARİ/FİNANSAL sorular sorulursa kesinlikle "Bu bilgi ticari sır kapsamındadır, cevaplayamam." de.
    3. HATA YAPMA: Eğer cevap verilerde yoksa (Örn: "Yarın hava nasıl?"), "Bu bilgi sistemimde mevcut değil" de, uydurma.
    4. ÜSLUP: Bir spor antrenörü gibi motive edici, saygılı ve kısa cevaplar ver.

    KULÜP VERİLERİ (JSON):
    ${JSON.stringify(clubData)}

    BAĞLAM:
    ${studentContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt }, // Sistem talimatını başa ekliyoruz
            { text: `SORU: ${userInput}` }
          ]
        }
      ]
    });

    return {
      text: response.text || "Anlaşıldı hocam.",
      sources: [] // Google Search kapalı olduğu için kaynak yok
    };
  } catch (e: any) {
    console.error("Gemini hata:", e);
    let errorMsg = "AI servisine şu an ulaşılamıyor.";
    
    if (e.message && e.message.includes('API key')) {
      errorMsg = "API Anahtarı hatası.";
    }
    
    return { text: errorMsg, sources: [] };
  }
};

/**
 * AI DRILL ÜRETİCİ
 */
export const generateNewDrillFromAI = async (
  sport: string = "Futbol"
): Promise<Drill> => {
  const ai = getAIClient();

  if (!ai) {
    return {
      id: `auto-${Date.now()}`,
      title: `${sport} Temel Drilli`,
      category: "Teknik",
      difficulty: 3,
      duration: "20 Dakika",
      ageGroup: "U10-U14",
      equipment: ["Top", "Huni"],
      description: "Temel teknik gelişimi amaçlayan sabit drill."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${sport} için altyapı seviyesinde (U12) bir antrenman drilli üret. JSON formatında olsun.`
            }
          ]
        }
      ],
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
          },
          required: ["title", "category", "difficulty", "duration", "description"]
        }
      }
    });

    if (!response.text) throw new Error("Boş yanıt");

    return {
      ...JSON.parse(response.text),
      id: `ai-${Date.now()}`
    };
  } catch (e) {
    console.error("Drill AI hatası:", e);
    return {
      id: `auto-${Date.now()}`,
      title: `${sport} Alternatif Drilli`,
      category: "Teknik",
      difficulty: 2,
      duration: "15 Dakika",
      ageGroup: "Genel",
      equipment: [],
      description: "AI servisi yanıt vermediği için oluşturulan otomatik dril."
    };
  }
};

export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "AI servisi şu anda kullanılamıyor.";

  try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            role: "user",
            parts: [{ text: `"${drill.title}" antrenmanı için 1 cümlelik teknik ipucu ver.` }]
          }
        ]
      });
      return res.text || "Dikkatli uygulayın.";
  } catch (e) {
    console.error("Drill tip hatası:", e);
    return "Forma dikkat edin.";
  }
};

export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = getAIClient();
  if (!ai) return "Gelişim devam ediyor (AI Kapalı).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: "user",
          parts: [{ text: `Sporcu ${student.name} için kısa, motive edici bir teknik gelişim notu yaz.` }]
        }
      ]
    });
    return response.text || "Takipteyiz.";
  } catch { return "Gelişim devam ediyor."; }
};