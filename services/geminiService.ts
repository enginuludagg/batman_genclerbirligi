
import { GoogleGenAI, Type } from "@google/genai";
import { AppContextData, Student, Drill, AppMode } from "../types";

// API Anahtarını al ve istemciyi yapılandır
const getAIClient = () => {
  const apiKey = process.env.API_KEY || "";
  return new GoogleGenAI({ apiKey });
};

/**
 * AI Servislerinde Hata Yönetimi İçin Yerel Bilgi Bankası (Fallbacks)
 */
const BGB_KNOWLEDGE_BASE = {
  drills: [
    { 
      title: "Pas-Destek Çalışması", 
      category: "Teknik", 
      difficulty: 3, 
      duration: "20 Dakika", 
      equipment: ["Top", "Huni"], 
      description: "İki oyuncu karşılıklı paslaşırken üçüncü oyuncu boş alanlara destek koşuları yapar. Batman GB temel teknik disiplini." 
    },
    { 
      title: "Defansif Yerleşim", 
      category: "Taktik", 
      difficulty: 4, 
      duration: "30 Dakika", 
      equipment: ["Yelek", "Huni"], 
      description: "Takımın bloklar arası mesafesini koruması üzerine yoğunlaşan yerleşim çalışması." 
    }
  ],
  responses: [
    "Hocam şu an sahadayım, analizleri Engin Hoca ile koordine ediyoruz. Gelişim odaklı çalışmaya devam!",
    "Batman Gençlerbirliği ruhuyla her geçen gün daha ileriye gidiyoruz. Sporcularımızın verilerini titizlikle analiz ediyorum.",
    "BGB Akademi'de her sporcu bizim için özeldir. Teknik gelişim ve karakter eğitimi önceliğimizdir."
  ]
};

/**
 * AI tarafından yeni bir antrenman drilli üretir.
 */
export const generateNewDrillFromAI = async (sport: string = 'Futbol'): Promise<Drill> => {
  if (!process.env.API_KEY) {
     return { ...BGB_KNOWLEDGE_BASE.drills[0], id: `fb-${Date.now()}` } as Drill;
  }

  const ai = getAIClient();
  const prompt = `Batman Gençlerbirliği (BGB) için ${sport} branşında, yaratıcı ve öğretici bir antrenman drilli üret. Yanıtın mutlaka JSON formatında olsun.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "Sen Batman Gençlerbirliği'nin baş antrenörüsün. SADECE JSON formatında yanıt ver. Category: 'Teknik', 'Kondisyon', 'Taktik' veya 'Eğlenceli Oyun' olmalı.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.INTEGER },
            duration: { type: Type.STRING },
            equipment: { type: Type.ARRAY, items: { type: Type.STRING } },
            description: { type: Type.STRING }
          },
          required: ["title", "category", "difficulty", "duration", "equipment", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty AI Response");
    
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const drillData = JSON.parse(cleanJson);
    
    return { 
      ...drillData, 
      id: `ai-${Date.now()}` 
    };
  } catch (error) {
    console.error("BGB AI Drill Error:", error);
    const fallback = BGB_KNOWLEDGE_BASE.drills[Math.floor(Math.random() * BGB_KNOWLEDGE_BASE.drills.length)];
    return { ...fallback, id: `fb-${Date.now()}` } as Drill;
  }
};

/**
 * BGB AI Asistanı - Ana Fonksiyon
 */
export const getAICoachResponse = async (userInput: string, context: AppContextData, mode: AppMode) => {
  if (!process.env.API_KEY) {
    return { text: BGB_KNOWLEDGE_BASE.responses[1] };
  }

  const ai = getAIClient();
  const sports = Array.from(new Set(context.students.map(s => s.sport)));
  
  const systemInstruction = `
    Sen Batman Gençlerbirliği (BGB) Spor Kulübü'nün resmi AI Asistanısın. 
    KULÜP BİLGİSİ: Batman, Branşlar: ${sports.join(', ')}, Toplam Sporcu: ${context.students.length}.
    KİMLİK: Engin Uludağ'ın dijital yardımcısı gibi davran. Profesyonel, vizyoner ve motive edici ol.
    KURAL: Hata mesajı verme. Teknik terimleri doğru kullan. Kısa ve net yanıtlar ver.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: userInput }] }],
      config: { systemInstruction, temperature: 0.7, topP: 0.95 }
    });

    return { text: response.text || BGB_KNOWLEDGE_BASE.responses[0] };
  } catch (error) {
    console.error("BGB AI Coach Error:", error);
    const randomFallback = BGB_KNOWLEDGE_BASE.responses[Math.floor(Math.random() * BGB_KNOWLEDGE_BASE.responses.length)];
    return { text: randomFallback };
  }
};

export const getCoachSuggestions = async (student: Student): Promise<string> => {
  if (!process.env.API_KEY) return "Antrenman disipliniyle gelişimini sürdürüyor.";
  
  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${student.name} isimli sporcu için 15 kelimelik teknik analiz yap.` }] }],
      config: { 
        systemInstruction: "BGB Teknik Direktörü gibi profesyonel ve teknik bir analiz cümlesi yaz. Motivasyonu yüksek tut." 
      }
    });
    return response.text || "Antrenman disipliniyle gelişimini sürdürüyor, teknik çalışmalarına ağırlık vermeli.";
  } catch (error) {
    return "Sporcumuzun fiziksel gelişimi ve taktik disiplini akademi standartlarımıza uygun ilerliyor.";
  }
};

export const getDrillAITips = async (drill: Drill): Promise<string> => {
  if (!process.env.API_KEY) return "Doğru teknik ve sürekli tekrar başarının anahtarıdır.";

  const ai = getAIClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: `${drill.title} çalışması için kritik bir teknik ipucu ver.` }] }],
      config: { 
        systemInstruction: "10 kelimeyi geçmeyen, saha içi uygulama başarısını artıracak teknik bir direktif ver." 
      }
    });
    return response.text || "Tempo ve alan paylaşımına dikkat ederek verimi artırın.";
  } catch (error) {
    return "Doğru teknik ve sürekli tekrar başarının anahtarıdır.";
  }
};
