
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

const CLUB_INFO = `
  KULÜP KİMLİĞİ:
  - İsim: Batman Gençlerbirliği (BGB) Spor Kulübü ve Akademisi
  - Kurucu: Engin Uludağ
  - Branşlar: Futbol, Voleybol, Cimnastik
  - Konum: Batman
`;

const getApiKey = () => {
  return process.env.API_KEY || '';
};

export const getAICoachResponse = async (
  userInput: string, 
  context: AppContextData, 
  mode: AppMode, 
  currentStudent?: Student | null
): Promise<{ text: string; sources: string[] }> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { text: "AI Servisi şu an yapılandırılmamış (API Key eksik).", sources: [] };
  }

  const ai = new GoogleGenAI({ apiKey });
  const now = new Date().toLocaleString('tr-TR');

  let specializedData = mode === 'admin' 
    ? `Yönetici Özeti: ${context.students.length} sporcu aktif.`
    : `Veli Modu: Sporcu ${currentStudent?.name || 'Seçilmedi'}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `
        Sen Batman Gençlerbirliği AI asistanısın. 
        GÜNCEL ZAMAN: ${now}.
        KULÜP BİLGİLERİ: ${CLUB_INFO}.
        VERİ BAĞLAMI: ${specializedData}.
        `
      }
    });

    const text = response.text || "Yanıt alınamadı.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: string[] = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: any): uri is string => typeof uri === 'string');
    
    return { text, sources: Array.from(new Set(sources)) };
  } catch (e: any) {
    console.error("Gemini Error:", e);
    if (e.code === 403) return { text: "Erişim Reddedildi (403). Lütfen API anahtarını kontrol edin.", sources: [] };
    return { text: "Bağlantı hatası oluştu.", sources: [] };
  }
};

export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key missing");
  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: [{ role: 'user', parts: [{ text: `${sport} için teknik antrenman drilli üret.` }] }],
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
        required: ["title", "category", "description", "difficulty", "duration"]
      }
    }
  });
  
  return { ...JSON.parse(response.text || '{}'), id: `ai-${Date.now()}` };
};

export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "İpucu servisi kapalı.";
  const ai = new GoogleGenAI({ apiKey });
  try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `"${drill.title}" için 1 cümlelik teknik ipucu ver.` }] }]
      });
      return res.text || "Dikkatli uygulayın.";
  } catch { return "Forma dikkat."; }
};

export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "AI Analiz kapalı.";
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Sporcu ${student.name} için teknik analiz yaz.` }] }]
    });
    return response.text || "Takipteyiz.";
  } catch { return "Gelişim devam ediyor."; }
};
