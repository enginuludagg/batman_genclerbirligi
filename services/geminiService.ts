
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

const CLUB_INFO = `
  KULÜP KİMLİĞİ:
  - İsim: Batman Gençlerbirliği (BGB) Spor Kulübü ve Akademisi
  - Kurucu ve Teknik Direktör: Engin Uludağ (TFF C, TVF 2. Kademe, TCF 2. Kademe Antrenör)
  - İletişim: 0505 340 11 01
  - Konum: Batman Merkez, BGB Tesisleri (Gültepe Mah.)
  - Branşlar: Futbol, Voleybol, Cimnastik
  - Renkler: Kırmızı - Siyah
`;

export const getAICoachResponse = async (userInput: string, context: AppContextData, mode: AppMode, currentStudent?: Student | null) => {
  if (!process.env.API_KEY) return { text: "API Key eksik. Lütfen ayarlardan kontrol edin." };

  const ai = getAIClient();
  const today = new Date().toLocaleDateString('tr-TR');

  let specializedData = mode === 'admin' 
    ? `Yönetici Özeti: ${context.students.length} sporcu, Kasa: ${context.finance.reduce((a, c) => c.type === 'income' ? a + c.amount : a - c.amount, 0)} TL.`
    : `Veli Modu: Sporcu ${currentStudent?.name || 'Seçilmedi'}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `
        Sen Batman Gençlerbirliği (BGB) asistanısın. 
        1. Sadece Batman ve BGB kulübü hakkında gerçek verilere dayanarak konuş.
        2. Hava durumu, güncel spor haberleri gibi konularda MUTLAKA Google Search kullan.
        3. Bilmediğin kulüp bilgilerinde "Bu bilgi sistemde yok, Engin Hoca'ya danışın" de.
        4. Kulüp Verileri: ${CLUB_INFO}. 
        5. Durum: ${specializedData}. 
        6. Tarih: ${today}.
        `
      }
    });

    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return { 
      text: text || "Anlaşıldı.",
      sources: sources.map((s: any) => s.web?.uri).filter(Boolean)
    };
  } catch (e) {
    console.error("AI Error:", e);
    return { text: "Bağlantı hatası oluştu." };
  }
};

export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${sport} için teknik antrenman drilli oluştur.` }] }],
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
          required: ["title", "category", "description"]
        }
      }
    });
    return { ...JSON.parse(response.text || '{}'), id: `ai-${Date.now()}` };
  } catch (e) {
    return { id: 'err', title: 'Hata', category: 'Teknik', difficulty: 1, duration: '10dk', equipment: [], description: 'AI hatası.' };
  }
};

export const getCoachSuggestions = async (student: Student) => {
  if (!process.env.API_KEY) return "Gelişimi devam ediyor.";
  const ai = getAIClient();
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${student.name} (${student.stats.technique} teknik) için kısa motive edici rapor.` }] }]
    });
    return res.text || "Başarılar dileriz.";
  } catch { return "Gelişimi olumlu."; }
};

export const getDrillAITips = async (drill: Drill) => {
  const ai = getAIClient();
  try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `${drill.title} için kısa antrenör ipucu.` }] }]
      });
      return res.text || "Tempoyu koruyun.";
  } catch { return "Dikkatli uygulayın."; }
};
