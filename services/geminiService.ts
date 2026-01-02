
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

const CLUB_INFO = `
  KULÜP KİMLİĞİ:
  - İsim: Batman Gençlerbirliği (BGB) Spor Kulübü ve Akademisi
  - Kurucu ve Teknik Direktör: Engin Uludağ (TFF C, TVF 2. Kademe, TCF 2. Kademe Antrenör)
  - Branşlar: Futbol, Voleybol, Cimnastik
  - Renkler: Kırmızı - Siyah
  - Konum: Batman Merkez
`;

/**
 * getAICoachResponse: Google Search destekli AI asistan yanıtı üretir.
 */
export const getAICoachResponse = async (
  userInput: string, 
  context: AppContextData, 
  mode: AppMode, 
  currentStudent?: Student | null
): Promise<{ text: string; sources: string[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const now = new Date().toLocaleString('tr-TR');

  let specializedData = mode === 'admin' 
    ? `Yönetici Özeti: ${context.students.length} sporcu aktif. Finans: ${context.finance.length} işlem kaydı mevcut.`
    : `Veli Modu: Sporcu ${currentStudent?.name || 'Seçilmedi'}. Sadece bu sporcu özelinde bilgi ver.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `
        Sen Batman Gençlerbirliği (BGB) resmi AI asistanısın. 
        GÜNCEL ZAMAN: ${now}.
        KULÜP BİLGİLERİ: ${CLUB_INFO}.
        VERİ BAĞLAMI: ${specializedData}.
        TALİMATLAR: Samimi ama profesyonel bir dil kullan. Google Search kaynaklarını mutlaka belirt.
        `
      }
    });

    const text = response.text || "Şu an yanıt veremiyorum.";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: string[] = groundingChunks
      .map((chunk: any) => chunk.web?.uri)
      .filter((uri: any): uri is string => typeof uri === 'string');
    
    return { 
      text,
      sources: Array.from(new Set(sources))
    };
  } catch (e) {
    console.error("Gemini Error:", e);
    return { text: "Bağlantı hatası oluştu, lütfen tekrar deneyin.", sources: [] };
  }
};

/**
 * generateNewDrillFromAI: Yeni antrenman drilli üretir.
 */
export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: `${sport} branşı için çocuklara uygun, yaratıcı bir teknik antrenman drilli üret.` }] }],
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
    
    const jsonStr = response.text || '{}';
    return { ...JSON.parse(jsonStr), id: `ai-${Date.now()}` };
  } catch (e) {
    console.error("Gemini Drill Error:", e);
    return { 
      id: 'err', 
      title: 'Hızlı Pas Çalışması', 
      category: 'Teknik', 
      difficulty: 2, 
      duration: '15dk', 
      equipment: ['Top', 'Huniler'], 
      description: 'AI şu an çevrimdışı, manuel ekleme yapabilirsiniz.' 
    };
  }
};

/**
 * getDrillAITips: Drill için kısa ipucu üretir.
 */
export const getDrillAITips = async (drill: Drill): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ role: 'user', parts: [{ text: `"${drill.title}" antrenmanı için 1 cümlelik profesyonel ipucu ver.` }] }]
      });
      return res.text || "Sporcuların formuna dikkat edin.";
  } catch { return "Tempoyu sabit tutun."; }
};

/**
 * getCoachSuggestions: Sporcu karnesi için teknik öneri üretir.
 */
export const getCoachSuggestions = async (student: Student): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `Sporcu ${student.name} için kısa teknik analiz yaz.` }] }],
      config: {
        systemInstruction: "Sen BGB Baş Antrenörüsün. Teknik ve motive edici kısa notlar yazarsın.",
      }
    });
    return response.text || "Gelişim süreci yakından takip ediliyor.";
  } catch (e) {
    return "Antrenmanlara düzenli katılım gelişimi destekleyecektir.";
  }
};
